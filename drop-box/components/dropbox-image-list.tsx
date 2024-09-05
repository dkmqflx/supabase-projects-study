"use client";

import { useQuery } from "@tanstack/react-query";
import DropboxImage from "./dropbox-image";
import { searchFiles } from "actions/storageActions";
import { Spinner } from "@material-tailwind/react";

export default function DropboxImageList({ searchInput }) {
  // 검색한 이미지만 보일 수 있도록 한다.
  const searchImagesQuery = useQuery({
    queryKey: ["images", searchInput],
    queryFn: () => searchFiles(searchInput),
  });

  return (
    <section className="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-2">
      {searchImagesQuery.isLoading && <Spinner />}
      {searchImagesQuery.data &&
        searchImagesQuery.data.map((image) => (
          <DropboxImage key={image.id} image={image} />
        ))}
    </section>
  );
}
