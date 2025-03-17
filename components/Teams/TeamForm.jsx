import { useState, useEffect } from "react";
import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import useLanguage from "@/hooks/useLanguage";
import UploadImage from "../btn/UploadImage";
import { Divider } from "@mui/material";
import useDB from "@/hooks/useDB";
import { toast } from "react-toastify";

export default function TeamForm({ teamData, onClose }) {
    const [team, setTeam] = useState({
        image: null,
        name: { en: "", th: "" },
        position: { en: "", th: "" },
        bio: { en: "", th: "" },
        active: true
    });
    const { lang } = useLanguage();
    const { add, update } = useDB("teams");

    useEffect(() => {
        if (teamData) {
            setTeam(teamData);
        }
    }, [teamData]);

    const handleUploadImage = (image) => {
        setTeam({ ...team, image: image[0] });
    };

    const handleTeamSubmit = async () => {
        if (teamData) {
            try {
                await update(teamData.id, team);
                toast.success(lang["team_updated_successfully"]);
                handleClear();
            } catch (error) {
                console.error("Error updating team:", error);
                toast.error(lang["something_went_wrong"]);
            }
        } else {
            try {
                await add(team);
                toast.success(lang["team_added_successfully"]);
                handleClear();
            } catch (error) {
                console.error("Error adding team:", error);
                toast.error(lang["something_went_wrong"]);
            }
        }
    };

    const handleClear = () => {
        setTeam({
            image: null,
            name: { en: "", th: "" },
            position: { en: "", th: "" },
            bio: { en: "", th: "" },
            active: true
        });
        onClose();
    };

    return (
        <div className="flex flex-col p-2 bg-white dark:bg-gray-800 text-black dark:text-gray-50 min-w-[500px] w-full h-full">
            {/* Header */}
            <div className="flex flex-row items-center justify-between mb-2 w-full">
                <h1 className="text-xl font-bold text-orange-500 dark:text-white">
                    {teamData ? lang["edit_team"] : lang["add_team"]}
                </h1>
                <IoCloseCircleOutline size={30} onClick={handleClear}/>
            </div>

            <Divider/>

            {/* Form */}
            <div className="flex flex-col p-4 gap-2 w-full">
                <div className="flex flex-col justify-center items-center gap-2">
                    {team?.image && 
                        <Image 
                            src={team.image.url} 
                            width={120} 
                            height={120} 
                            alt="Team Image" 
                            className="rounded-full"
                            loading="lazy"
                        />
                    }
                    <UploadImage
                        onUpload={handleUploadImage}
                        folder="teams"
                        size={30}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-black dark:text-gray-400">{lang["name"]}</label>
                    <input 
                        type="text" 
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2" 
                        placeholder={lang["name"]+" (EN)"} 
                        value={team.name.en} 
                        onChange={(e) => setTeam({ ...team, name: { ...team.name, en: e.target.value } })}
                    />
                    <input 
                        type="text" 
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2" 
                        placeholder={lang["name"]+" (TH)"} 
                        value={team.name.th} 
                        onChange={(e) => setTeam({ ...team, name: { ...team.name, th: e.target.value } })}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-black dark:text-gray-400">{lang["position"]}</label>
                    <input 
                        type="text" 
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2" 
                        placeholder={lang["position"]+" (EN)"} 
                        value={team.position.en} 
                        onChange={(e) => setTeam({ ...team, position: { ...team.position, en: e.target.value } })}
                    />
                    <input 
                        type="text" 
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2" 
                        placeholder={lang["position"]+" (TH)"} 
                        value={team.position.th} 
                        onChange={(e) => setTeam({ ...team, position: { ...team.position, th: e.target.value } })}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-black dark:text-gray-400">{lang["bio"]}</label>
                    <input 
                        type="text" 
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2" 
                        placeholder={lang["bio"]+" (EN)"} 
                        value={team.bio.en} 
                        onChange={(e) => setTeam({ ...team, bio: { ...team.bio, en: e.target.value } })}
                    />
                    <input 
                        type="text" 
                        className="text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2" 
                        placeholder={lang["bio"]+" (TH)"} 
                        value={team.bio.th} 
                        onChange={(e) => setTeam({ ...team, bio: { ...team.bio, th: e.target.value } })}
                    />
                </div>
            </div>
            <div className="flex flex-row gap-2 p-4">
                <button 
                    className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    onClick={() => handleTeamSubmit()}
                >
                    {teamData ? lang["edit_team"] : lang["add_team"]}
                </button>

                <button 
                    className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    onClick={onClose}
                >
                    {lang["cancel"]}
                </button>
            </div>
        </div>
    );
}