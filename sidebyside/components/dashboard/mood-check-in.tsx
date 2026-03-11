"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateMood } from "@/app/actions/couple";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MoodCheckInProps } from "@/types/mood";
import { Smile } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ActionButton from "../action-button";

const MOODS = [
  { emoji: "🥰", label: "Zamilovaně" },
  { emoji: "😁", label: "Skvěle" },
  { emoji: "😀", label: "Dobře" },
  { emoji: "😐", label: "Ujde to" },
  { emoji: "😔", label: "Smutně" },
  { emoji: "😤", label: "Naštvaně" },
  { emoji: "😴", label: "Unaveně" },
  { emoji: "😰", label: "Stresově" },
];

function isTodayMood(updatedAt: string | null): boolean {
  if (!updatedAt) return false;
  return new Date(updatedAt).toDateString() === new Date().toDateString();
}

export function MoodCheckIn({
  myMood,
  myMoodUpdatedAt,
  partnerMood,
  partnerMoodUpdatedAt,
  myNickname,
  partnerNickname,
  myAvatar,
  partnerAvatar,
  compact = false,
}: MoodCheckInProps) {
  const [currentMood, setCurrentMood] = useState<string | null>(
    isTodayMood(myMoodUpdatedAt) ? myMood : null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const partnerMoodToday = isTodayMood(partnerMoodUpdatedAt) ? partnerMood : null;

  const handleSelect = async (emoji: string) => {
    setIsLoading(true);
    setCurrentMood(emoji);
    setOpen(false);
    const result = await updateMood(emoji);
    setIsLoading(false);
    if (!result?.success) {
      setCurrentMood(null);
      toast.error("Nepodařilo se uložit náladu.");
    } else {
      toast.success("Nálada sdílena! 💌");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Partner */}
      {!compact && (
        <>
          <div className="flex items-center gap-1.5">
            <Avatar className="size-7">
              <AvatarImage src={partnerAvatar ?? undefined} />
              <AvatarFallback className="text-xs">{partnerNickname[0]}</AvatarFallback>
            </Avatar>
            <span className="text-lg leading-none">
              {partnerMoodToday ?? <span className="text-muted-foreground text-xs">–</span>}
            </span>
          </div>
        </>
      )}

      {/* Divider */}
      <Separator orientation="vertical" className="hidden sm:inline bg-muted-foreground/40 select-none"/>

      {/* Já — trigger dialogu */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            disabled={isLoading}
            title="Jak se dnes cítíš?"
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full",
              "hover:bg-muted transition-colors cursor-pointer",
              "disabled:opacity-50"
            )}
          >
            <Avatar className="size-7">
              <AvatarImage src={myAvatar ?? undefined} />
              <AvatarFallback className="text-xs">{myNickname[0]}</AvatarFallback>
            </Avatar>
            <span className="text-lg leading-none">
              {currentMood ?? <Smile className="size-4 text-muted-foreground" />}
            </span>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Jak se dnes cítíš?</DialogTitle>
          </DialogHeader>

          {/* Partner mood v dialogu — viditelné i na mobilu */}
          <div className="flex items-center gap-2 bg-muted/40 px-3 py-2 rounded-lg text-sm">
            <Avatar className="size-6">
              <AvatarImage src={partnerAvatar ?? undefined} />
              <AvatarFallback className="text-xs">{partnerNickname[0]}</AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground">{partnerNickname.split(" ")[0]}:</span>
            <span className="text-lg">
              {partnerMoodToday ?? <span className="text-muted-foreground text-xs italic">ještě nesdílel/a</span>}
            </span>
          </div>

          <div className="gap-2 grid grid-cols-4 pt-2">
            {MOODS.map((mood) => (
              <button
                key={mood.emoji}
                onClick={() => handleSelect(mood.emoji)}
                disabled={isLoading}
                aria-label={mood.label}
                className={cn(
                          "flex flex-col justify-center items-center gap-2 hover:bg-muted p-4 border rounded-md text-lg transition-all",
                          currentMood === mood.emoji
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted text-muted-foreground"
                )}
              >
                {mood.emoji}
                <span className="text-[10px] text-muted-foreground">{mood.label}</span>
              </button>
            ))}
          </div>

          {currentMood && (
            <ActionButton
              onClick={() => { setCurrentMood(null); setOpen(false); }}
              className="inset-shadow-black bg-destructive hover:bg-red-500 mt-2 w-full text-sm text-center"
            >
              Vymazat náladu
            </ActionButton>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
