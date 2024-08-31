import { atom } from "recoil";

export const NotificationOfCommingMessageAtom = atom({
  key: "NotificationOfCommingMessageAtom",
  default: [],
});

export const SelectedImageAtom = atom({
  key: "SelectedImageAtom",
  default: {
    createdAt: null,
    image: null,
    messageId: null,
    senderId: null,
    senderName: null,
  },
});
