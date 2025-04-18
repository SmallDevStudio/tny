import { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";
import useDB from "@/hooks/useDB";

export default function ParticipantsModel({
  onClose,
  setParticipants,
  participants,
}) {
  const { t, lang } = useLanguage();
  const { getAll } = useDB("teams");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);

  useEffect(() => {
    getAll().then((res) => {
      const formatted = res.map((team, idx) => ({
        ...team,
        id: team.id || team.teamId || `team-${idx}`,
      }));
      setTeams(formatted);
    });
  }, []);

  useEffect(() => {
    if (participants && participants.length > 0 && teams.length > 0) {
      const mergedParticipants = participants
        .map((p) => teams.find((t) => t.id === p.id))
        .filter(Boolean);
      setSelectedTeam(mergedParticipants);
      console.log("participants passed in:", participants);
    }
  }, [participants, teams]);

  const handleSelectTeam = (team) => {
    if (!team?.id) {
      console.warn("ทีมที่เลือกไม่มี id", team);
      return;
    }
    if (selectedTeam.some((t) => t.id === team.id)) {
      setSelectedTeam(selectedTeam.filter((t) => t.id !== team.id));
    } else {
      setSelectedTeam([...selectedTeam, team]);
    }
  };

  const handleCancel = () => {
    setSelectedTeam([]);
    onClose();
  };

  const handleAddParticipants = () => {
    console.log("selectedTeam to save:", selectedTeam);
    setParticipants(selectedTeam);
    setSelectedTeam([]);
    onClose();
  };

  const filteredTeams = teams.filter(
    (team) => !selectedTeam.some((t) => t.id === team.id)
  );

  const handleRemove = (teamId) => {
    const removed = selectedTeam.find((t) => t.id === teamId);
    if (removed) {
      setSelectedTeam(selectedTeam.filter((t) => t.id !== teamId));
    }
  };

  console.log("teams", teams);

  return (
    <div className="w-full h-full mb-2">
      {/* Header */}
      <div className="flex flex-row justify-between items-center p-2 bg-orange-500 text-white font-bold">
        <h2>{lang["participants"]}</h2>
        <IoClose size={24} onClick={onClose} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Available teams (Right Side) */}
          <div className="flex flex-col gap-2 bg-gray-100 rounded-md p-2 h-[300px] overflow-y-auto">
            <h3 className="text-sm font-semibold">{lang["teams"]}</h3>
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="flex flex-row items-center bg-white p-2 rounded-md shadow-sm cursor-pointer hover:bg-gray-50"
                onClick={() => handleSelectTeam(team)}
              >
                <div>
                  <Image
                    src={team.image.url}
                    alt={t(team.name) + "-image"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <span>{t(team.name)}</span>
              </div>
            ))}
          </div>

          {/* Selected participants (Left Side) */}
          <div className="flex flex-col gap-2 bg-gray-100 rounded-md p-2 h-[300px] overflow-y-auto">
            <h3 className="text-sm font-semibold">{lang["participants"]}</h3>
            {selectedTeam.map((team) => (
              <div
                key={team.id}
                className="flex flex-row items-center justify-between bg-white p-2 rounded-md shadow-sm"
              >
                <span>{t(team.name)}</span>
                <IoClose
                  size={20}
                  className="cursor-pointer text-red-500"
                  onClick={() => handleRemove(team.id)}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-row justify-center gap-2 mt-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            onClick={handleAddParticipants}
          >
            {lang["save"]}
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={handleCancel}
          >
            {lang["cancel"]}
          </button>
        </div>
      </div>
    </div>
  );
}
