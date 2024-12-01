"use client";

import React from "react";
import { DiscussionEmbed } from 'disqus-react';




const Comments: React.FC<{ postId: number, postTitle: string, postSlug: string, }> = ({ postId, postTitle }) => {

  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
      <DiscussionEmbed
          shortname='vinsmemegeorgette'
          config={
              {
                  url: `https://vinsmemegeorgette.com/blog/${postTitle}`,
                  identifier: postId.toString(),
                  title: `${postTitle}`
              }
          }
      />
    </section>
  );
};

export default Comments;
