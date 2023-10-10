import { Send } from "lucide-react";
import * as React from "react";

import { cn } from "../lib/utils";

import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
function App() {
  const [input, setInput] = React.useState("");
  const inputLength = input.trim().length;
  type MessageData = {
    id: string;
    timestamp: number;
    channel: string;
    data: string;
    name: string;
  };
  const [messages, setMessages] = React.useState<MessageData[]>([
    {
      id: "iHpUuGFLvy:0:0",
      timestamp: 1696771088426,
      channel: "channel1",
      data: "Hey, I'm having trouble with my account.",
      name: "tzusamen",
    },
    {
      id: "etmuxiS_Zt:0:0",
      timestamp: 1696770820546,
      channel: "channel1",
      data: "meinshaft",
      name: "tzusamen",
    },
    {
      id: "IpFSBgbY2C:0:0",
      timestamp: 1696770783345,
      channel: "channel1",
      data: "bvb",
      name: "deutcher meister",
    },
  ]);

  const chatroomTitle = "#GAME OF SECRET CHATROOM";
  const eventSourceString =
    "https://realtime.ably.io/sse?v=1.2&channels=channel1&key=qRXQpA.YkOXtw:fTxs7siJ5I131E1krpPdpZiDf0Vx2Hrx3xx_D1cqyxk";
  React.useEffect(() => {
    const sse = new EventSource(eventSourceString, { withCredentials: true });
    function getRealtimeData(data: MessageData) {
      setMessages((prev) => [...prev, data]);
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      alert("EventSource failed.");
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, []);
  return (
    <main>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-lg font-medium text-muted-foreground">
                {chatroomTitle}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  "bg-muted",
                  // message.role === "user"
                  //   ? "ml-auto bg-primary text-primary-foreground"
                  //   : "bg-muted"
                )}
              >
                <div className={cn()}>{message.name}</div>
                {message.data}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (inputLength === 0) return;
              setMessages([
                ...messages,
                {
                  id: "iHpUuGFLvy:0:0",
                  timestamp: 1696771088426,
                  channel: "channel1",
                  data: input,
                  name: "meizer",
                },
              ]);
              setInput("");
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}

export default App;
