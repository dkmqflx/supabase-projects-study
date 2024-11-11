'use client';

export default function Message({ isFromMe, message }) {
  // isFromMe => 내가 보낸 메세지
  return (
    <div
      className={`w-fit p-3 rounded-md ${
        isFromMe
          ? 'ml-auto bg-light-blue-600 text-white'
          : 'bg-gray-100 text-black'
      }`}
    >
      <p>{message}</p>
    </div>
  );
}
