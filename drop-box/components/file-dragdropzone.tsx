"use client";

import { Button, Spinner } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { uploadFile } from "actions/storageActions";
import { queryClient } from "config/ReactQueryClientProvider";
import { useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function FileDragDropZone() {
  const fileRef = useRef(null); // 해당 코드는 드래그 앤 드롭 없이 form으로 구현할 때 사용된 코드
  // https://github.com/lopun/inflearn-supabase-dropbox-clone/commit/9da557b1376319829ac122621b7b13f5fb09138d

  const uploadImageMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["images"],
      });
      // 업로드 후 캐시를 날려서 최신 이미지 리스트가 보이도록 한다
    },
  });

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();

      acceptedFiles.forEach((file) => {
        formData.append(file.name, file);
      });

      await uploadImageMutation.mutate(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true, // 여러 파일을 올릴 수 있다.
  });
  // react dropzon 사용법
  // https://react-dropzone.js.org/

  return (
    // 공식문서에 따라 div와 input 태그를 넣어주어야 한다.
    <div
      {...getRootProps()}
      className="w-full py-20 border-4 border-dotted border-indigo-700 flex flex-col items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploadImageMutation.isPending ? (
        <Spinner />
      ) : isDragActive ? (
        <p>파일을 놓아주세요.</p>
      ) : (
        <p>파일을 여기에 끌어다 놓거나 클릭하여 업로드하세요.</p>
      )}
    </div>
  );
}
