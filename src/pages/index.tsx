import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import SidebarLayout from "~/layouts/SidebarLayout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const router = useRouter();
  const askQuestion = api.conversation.askQuestion.useMutation();

  const [question, setQuestion] = useState("");

  const utils = api.useContext();
  const handleAskQuestion = async () => {
    const result = await askQuestion.mutateAsync({
      question,
    });

    utils.conversation.getConversationEntries.setData(
      { conversationId: result.conversationId },
      (prev) => {
        if (!prev) return [result];
        return [...prev, result];
      }
    );

    await router.push(`/${result.conversationId}`);
  };

  return (
    <SidebarLayout>
      <div className="flex h-full flex-col">
        <section
          id="content-section"
          className="flex grow items-center justify-center text-2xl font-bold"
        >
          Morning, what would you like to do today?
        </section>
        <div className="flex gap-4">
          <input
            type="text"
            className="input"
            placeholder="Enter your question here.."
            onChange={(e) => setQuestion(e.currentTarget.value)}
            value={question}
          />
          <button className="btn-main" onClick={() => void handleAskQuestion()}>
            Ask Question
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Home;
