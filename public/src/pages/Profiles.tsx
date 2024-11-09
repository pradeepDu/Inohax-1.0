import { ChangeEvent, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import { useAppSelector } from "./redux";
import { useNavigate } from "react-router-dom";

const Profiles = () => {
  const navigate = useNavigate()
  const randomUser = useAppSelector((store) => store.randomUsers);
  const [tag, setTag] = useState<string>("");

  const selectIntern = (e: ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
  };

  const filteredUsers = randomUser
    .slice() // Create a copy of the array
    .filter((profile) =>
      tag === "" || profile.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
    )
    .sort((a, b) => b.stars - a.stars); // Sort by stars in descending order

  console.log(filteredUsers); // Log filtered users for debugging

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl font-mono font-bold text-center p-7">
        Search Potential Interns
      </h1>
      <button className="btn btn-accent absolute top-10 right-10" onClick={()=>navigate('/create-room')}>Host Meeting</button>
      <div className="input-group flex flex-row justify-center items-center w-[50%]">
        <div className="relative w-full flex justify-center items-center">
          <input
            type="text"
            placeholder="Enter quiz topic..."
            className="input input-bordered w-[50%] pl-10" // Add padding for the icon
            value={tag}
            onChange={selectIntern}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {filteredUsers.map((profile, index) => (
          <ProfileCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default Profiles;
