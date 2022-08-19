import React, { useState } from "react";
import { ITrack } from "../../types/track";
import MainLayout from "../../layouts/MainLayout";
import { Button, Card, Grid, TextField } from "@material-ui/core";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import axios from "axios";
import { useInput } from "../../hooks/useInput";

const TrackPage = ({ serverTrack }) => {
  const [track, setTrack] = useState<ITrack>(serverTrack);
  const router = useRouter();
  const username = useInput("");
  const text = useInput("");

  const addComment = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/tracks/comment",
        {
          username: username.value,
          text: text.value,
          trackId: track._id,
        }
      );
      setTrack({ ...track, comments: [...track.comments, response.data] });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <MainLayout
      style={{ overflow: "scroll" }}
      title={"Music Platform - " + track.name + " - " + track.artist}
      keywords={"Music, Artists " + track.name + ", " + track.artist}
    >
      <Button
        variant={"outlined"}
        style={{ fontSize: 32 }}
        onClick={() => router.push("/tracks")}
      >
        to List
      </Button>
      <Grid container style={{ margin: "20px 0" }}>
        <img
          src={"http://localhost:5000/" + track.picture}
          width={200}
          height={200}
        />
        <div style={{ marginLeft: 30 }}>
          <h2>Track Name - {track.name}</h2>
          <h2>Track Artist - {track.artist}</h2>
          <h2>Listens - {track.listens}</h2>
        </div>
      </Grid>
      <h2>Tracks Lyrics</h2>
      <p>{track.text}</p>
      <h2>Comments</h2>
      <Grid container>
        <TextField
          label="Username"
          fullWidth
          {...username}
          style={{ marginTop: 10 }}
        />
        <TextField
          label="Comment"
          {...text}
          fullWidth
          multiline
          rows={4}
          style={{ marginTop: 10 }}
        />
        <Button onClick={addComment} style={{ margin: 10 }}>
          Send
        </Button>
      </Grid>
      <div>
        {track.comments.map((comment) => (
          <Card style={{ marginTop: 10 }}>
            <div>
              <div>
                {" "}
                <span style={{ fontWeight: "bold" }}> Username -</span>{" "}
                {comment.username}
              </div>
              <div>
                {" "}
                <span style={{ fontWeight: "bold" }}>Comment - </span>
                {comment.text}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </MainLayout>
  );
};

export default TrackPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const response = await axios.get("http://localhost:5000/tracks/" + params.id);
  return {
    props: {
      serverTrack: response.data,
    },
  };
};
