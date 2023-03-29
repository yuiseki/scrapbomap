/* eslint-disable @next/next/no-html-link-for-pages */
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    router.replace(`/scrapbox/${id}`);
  }, [id, router]);

  return null;
};

export default Post;
