"use client";
import { useEffect } from "react";
import { setSentryTagsClient } from "@/lib/sentry-tags";

export default function SentryInit(props: {
  firmCode?: string;
  advisorId?: string;
}) {
  useEffect(() => {
    setSentryTagsClient({
      firmCode: props.firmCode,
      advisorId: props.advisorId,
    });
  }, [props.firmCode, props.advisorId]);

  return null; // renders nothing
}