
import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { BattleHealthBar } from "@/components/BattleHealthBar";
import { BattleRoom } from "@/components/battle/BattleRoom";
import { ProblemDescription } from "@/components/battle/ProblemDescription";
import { CodeEditor } from "@/components/battle/CodeEditor";
import { BattleSkills } from "@/components/battle/BattleSkills";
import { useBattleState } from "@/hooks/useBattleState";
import { useCodeEditor } from "@/hooks/useCodeEditor";
import { INITIAL_CODE, Language } from "@/types/battle";

const Battle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("javascript");
  const { battleState, useSkill, buyHint } = useBattleState();
  const { code, setCode, textareaRef, handleKeyDown, handleChange } = useCodeEditor(currentRoom, user?.id);

  // Initialize code when language changes
  React.useEffect(() => {
    setCode(INITIAL_CODE[language]);
  }, [language, setCode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="pt-16">
        <BattleHealthBar />
        <div className="container px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Lobby
            </button>
            
            <BattleRoom
              currentRoom={currentRoom}
              setCurrentRoom={setCurrentRoom}
              setCode={setCode}
              initialCode={INITIAL_CODE[language]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProblemDescription 
              battleState={battleState} 
              useSkill={useSkill}
              buyHint={buyHint}
            />
            
            <CodeEditor
              code={code}
              language={language}
              setLanguage={setLanguage}
              textareaRef={textareaRef}
              handleKeyDown={handleKeyDown}
              handleChange={handleChange}
              currentRoom={currentRoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;
