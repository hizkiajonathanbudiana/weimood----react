import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChatHistory,
  fetchChatDetail,
  saveChat,
  deleteChat,
  clearUnsavedChat,
  clearDetail,
} from "../features/chat/chatSlice";

function DetailModal({ chatItem, detailData, detailStatus, onClose }) {
  let content;

  if (chatItem.isUnsaved) {
    content = (
      <pre>
        {JSON.stringify({ text: chatItem.text, mood: chatItem.mood }, null, 2)}
      </pre>
    );
  } else if (detailStatus === "loading") {
    content = <div>Loading detail…</div>;
  } else if (detailData) {
    content = <pre>{JSON.stringify(detailData, null, 2)}</pre>;
  } else {
    content = <p>No details available.</p>;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white/80 backdrop-blur-xl w-full max-w-lg rounded-xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">Chat Detail</h2>
        <div className="bg-gray-100/80 p-4 rounded-lg max-h-80 overflow-y-auto font-mono text-xs">
          {content}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function ChatListPanel() {
  const dispatch = useDispatch();
  const { dbHistory, unsavedChat, detail, detailStatus, status } = useSelector(
    (s) => s.chat
  );

  const [showSaved, setShowSaved] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailItem, setDetailItem] = useState(null);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  const list = showSaved
    ? dbHistory
    : unsavedChat
    ? [{ ...unsavedChat, id: "local", isUnsaved: true }]
    : [];

  const visibleList = list.slice(0, 10);

  const handleDetail = (chat) => {
    setDetailItem(chat);
    setShowDetailModal(true);
    if (!chat.isUnsaved) {
      dispatch(clearDetail());
      dispatch(fetchChatDetail(chat.id));
    }
  };

  const handleDelete = (chat) => {
    if (chat.isUnsaved) {
      dispatch(clearUnsavedChat());
    } else {
      dispatch(deleteChat(chat.id));
    }
  };

  const handleSave = (chat) => {
    dispatch(saveChat({ text: chat.text, mood: chat.mood }));
  };

  return (
    <div className="h-full bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg p-4 sm:p-6 flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 text-center mb-4 flex-shrink-0">
        Chat History
      </h2>

      <div className="flex-shrink-0 flex gap-2 p-1 bg-gray-200/60 rounded-lg">
        <button
          onClick={() => setShowSaved(false)}
          className={`w-full py-1.5 text-sm font-semibold rounded-md transition-colors ${
            !showSaved
              ? "bg-white shadow text-purple-700"
              : "text-gray-600 hover:bg-white/50"
          }`}
        >
          Unsaved
        </button>
        <button
          onClick={() => setShowSaved(true)}
          className={`w-full py-1.5 text-sm font-semibold rounded-md transition-colors ${
            showSaved
              ? "bg-white shadow text-purple-700"
              : "text-gray-600 hover:bg-white/50"
          }`}
        >
          Saved
        </button>
      </div>

      <div className="mt-4 flex-grow overflow-y-auto space-y-2 pr-1 min-h-[200px]">
        {status === "loading" && (
          <div className="p-4 text-center text-gray-500">Loading history…</div>
        )}
        {status !== "loading" && visibleList.length === 0 && (
          <div className="p-4 text-center text-gray-500 h-full flex items-center justify-center">
            <p>No chats to display.</p>
          </div>
        )}
        {status !== "loading" &&
          [...visibleList].reverse().map((chat) => (
            <div
              key={chat.id}
              className="p-3 bg-white/50 rounded-lg shadow-sm space-y-2"
            >
              <p className="text-sm text-gray-800 line-clamp-2">{chat.text}</p>
              <div className="flex justify-end gap-2">
                {chat.isUnsaved && (
                  <button
                    onClick={() => handleSave(chat)}
                    className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => handleDetail(chat)}
                  className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                >
                  Detail
                </button>
                <button
                  onClick={() => handleDelete(chat)}
                  className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {showDetailModal && (
        <DetailModal
          chatItem={detailItem}
          detailData={detail}
          detailStatus={detailStatus}
          onClose={() => {
            setShowDetailModal(false);
            dispatch(clearDetail());
          }}
        />
      )}
    </div>
  );
}
