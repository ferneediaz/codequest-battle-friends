
import { Button } from "@/components/ui/button";
import { UserPlus, Search, X } from "lucide-react";
import { useState } from "react";

const MOCK_FRIENDS = [
  { id: 1, name: "Alice", rank: "Divine", status: "Online" },
  { id: 2, name: "Bob", rank: "Ancient", status: "In Battle" },
  { id: 3, name: "Charlie", rank: "Legend", status: "Online" },
  { id: 4, name: "Diana", rank: "Immortal", status: "Offline" },
];

export function PartyInvite() {
  const [partyMembers, setPartyMembers] = useState<typeof MOCK_FRIENDS>([]);

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-black/90 border border-white/10 rounded-lg shadow-xl">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Party</h3>
          <Button variant="ghost" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Current Party ({partyMembers.length}/4)</h4>
          {partyMembers.length === 0 ? (
            <p className="text-sm text-gray-500">No members yet</p>
          ) : (
            partyMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
                <div>
                  <span className="text-sm text-white">{member.name}</span>
                  <span className="text-xs text-gray-400 ml-2">{member.rank}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Online Friends</h4>
          {MOCK_FRIENDS.filter(f => f.status === "Online").map(friend => (
            <div key={friend.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
              <div>
                <span className="text-sm text-white">{friend.name}</span>
                <span className="text-xs text-gray-400 ml-2">{friend.rank}</span>
                <span className="text-xs text-green-400 ml-2">{friend.status}</span>
              </div>
              <Button variant="ghost" size="sm">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
