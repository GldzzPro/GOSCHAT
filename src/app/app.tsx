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
    mine?: boolean;
  };
  const [messages, setMessages] = React.useState<MessageData[]>([]);
  const running = React.useRef(true);
  const pending = React.useRef(new Set<string>());
  const waiting = React.useRef<Promise<void>>();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [currentTry, nextTry] = React.useReducer((s) => s + 1, 0);

  const chatroomTitle = "#GAME OF SECRETS CHATROOM";
  const eventSourceString =
    "https://realtime.ably.io/sse?v=1.2&channels=channel1&key=qRXQpA.YkOXtw:fTxs7siJ5I131E1krpPdpZiDf0Vx2Hrx3xx_D1cqyxk";
  React.useEffect(() => {
    console.log(scrollRef.current?.lastElementChild)
    scrollRef.current?.lastElementChild?.scrollIntoView();
  }, [messages]);
  React.useEffect(() => {
    running.current = true;
    const sse = new EventSource(eventSourceString, { withCredentials: true });
    async function getRealtimeData(data: MessageData) {
      console.log({ data });
      await waiting.current;
      console.log({ done: 1 });
      setMessages((prev) => {
        const id = data.id.slice(0, -2);

        if (pending.current.has(id)) {
          pending.current.delete(id);
          data.mine = true;
        }
        return [...prev, data];
      });
    }
    sse.onmessage = (e) => getRealtimeData(JSON.parse(e.data));
    sse.onerror = () => {
      console.log("errrrrrrrrrrrr");
      const isRunning = running.current;
      sse.close();
      if (!isRunning) return;
      nextTry();
    };
    return () => {
      running.current = false;
      sse.close();
    };
  }, [currentTry]);
  const send = async () => {
    if (inputLength === 0) return;
    setInput("");
    waiting.current = Promise.resolve(waiting.current)
      .then(async () => {
        const res = await fetch(
          "https://rest.ably.io/channels/channel1/messages",
          {
            method: "POST",
            body: JSON.stringify({ name: "msg", data: input }),
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic cVJYUXBBLllrT1h0dzpmVHhzN3NpSjVJMTMxRTFrcnBQZHBaaURmMFZ4MkhyeDN4eF9EMWNxeXhr",
            },
          }
        );
        const msg: { messageId: string } = await res.json();
        pending.current.add(msg.messageId);
      })
      .catch(() => {
        alert("Network Error");
      });
  };
  console.log(messages);
  return (
    <main>
      <Card className="h-screen flex flex-col">
        <CardHeader className="flex flex-row items-center">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-lg font-medium text-muted-foreground">
                {chatroomTitle}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grow overflow-y-auto space-y-4" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                  "bg-muted","whitespace-pre",
                  message.mine
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.data}
              </div>
            ))}
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              send();
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
