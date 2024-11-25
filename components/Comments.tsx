"use client";

import React, { useEffect, useState } from "react";
import { DiscussionEmbed } from 'disqus-react';


interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  date: string;
  authorAvatar: string | null;
}

const Comments: React.FC<{ postId: number }> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/commentaires?post=${postId}`);
        const data = await response.json();

        if (data.success && data.comments) {
          setComments(data.comments);
        } else {
          setError("Erreur lors de la récupération des commentaires.");
        }
      } catch (err) {
        setError(`Erreur : ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  if (isLoading) return <p>Chargement des commentaires...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (comments.length === 0) return <p>Aucun commentaire pour cet article.</p>;

  return (
    <section className="mt-10 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Commentaires</h2>
      <DiscussionEmbed
          shortname='vinsmemegeorgette'
          config={
              {
                  url: `https://vinsmemegeorgette.com/blog/${postId}`,
                  identifier: postId.toString(),
                  title: `Post ${postId}`,
                  language: 'fr'
              }
          }
      />
    </section>
  );
};

export default Comments;
