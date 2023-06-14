import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SidebarLayout from "~/layouts/SidebarLayout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const askQuestion = api.conversation.askQuestion.useMutation();

  const handleAskQuestion = async () => {
    const result = await askQuestion.mutateAsync({
      question: "How are you?",
      conversationId: "1",
    });

    console.log(result);
  };

  return (
    <SidebarLayout>
      <button className="btn-main" onClick={() => void handleAskQuestion()}>
        Ask Question
      </button>
    </SidebarLayout>
  );
};

export default Home;
