import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug } from "./blog";

describe("blog", () => {
  it("returns all posts sorted by date descending", async () => {
    const posts = await getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      );
    }
  });

  it("each post has required frontmatter", async () => {
    const posts = await getAllPosts();
    posts.forEach((post) => {
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.slug).toBeTruthy();
    });
  });

  it("finds a post by slug", async () => {
    const posts = await getAllPosts();
    const found = await getPostBySlug(posts[0].slug);
    expect(found).toBeDefined();
    expect(found!.title).toBe(posts[0].title);
  });
});
