"use client";
// 아래처럼 useState를 사용하기 위해서는 클라이언트 컴포넌트여야 한다.
// 이렇게 별도의 UI 컴포넌트 만드는 이유는 page 파일을 클라이언트 컴포넌트로 만드는 것이 좋지 않기 때문
// 왜냐하면 클라이언트라면 metadata 같은 것들을 사용할 수 없게 된다.

import DropboxImageList from "components/dropbox-image-list";
import FileDragDropZone from "components/file-dragdropzone";
import Logo from "components/logo";
import SearchComponent from "components/search-component";
import Image from "next/image";
import { useState } from "react";

export default function UI() {
  const [searchInput, setSearchInput] = useState("");

  return (
    <main className="w-full p-2 flex flex-col gap-4">
      {/* Logo */}
      <Logo />

      {/* Search Component */}
      <SearchComponent
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />

      {/* File Drag&Drop Zone */}
      <FileDragDropZone />

      {/* Dropbox Image List */}
      <DropboxImageList searchInput={searchInput} />
    </main>
  );
}
