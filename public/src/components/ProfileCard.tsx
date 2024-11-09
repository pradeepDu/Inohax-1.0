// ProfileCard.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../pages/redux';

const ProfileCard = ({ profile }: { profile: any }) => {
  const userTags = useAppSelector((zoom) => zoom.userInfo.userInfo?.tags)
  const [image, setImage] = useState<string>("");
  console.log(profile)

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate random 4-digit number
        const response = await axios.get(`https://api.multiavatar.com/${randomNumber}.svg?apikey=LfMK8pr4mPhXew`);
        setImage(response.data); // Set the SVG avatar
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };

    fetchAvatar(); // Call the async function inside useEffect
  }, []);

  const { username, collegeName, year, stars, tags, email } = profile;
  const emailLink = `mailto:${email}`;
  return (
    <div className="card bg-slate-800 shadow-xl w-72 p-4 m-4">
      <figure className="px-10 pt-10">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
          alt="Profile Pic"
          className="rounded-full w-24 h-24 mask mask-circle"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-2xl font-bold">{username}</h2>
        <a href={emailLink} className="link link-primary">{email}</a>
        <p className="text-base-content/70">{collegeName}</p>
        <p className="text-base-content/70">Academic Year: {year}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {userTags?.map((tag, index) => (
            <span key={index} className="badge badge-outline">#{tag}Expert</span>
          ))}
        </div>
        <div className="rating mt-2">
          {[...Array(stars)].map((_, index) => (
            <input
              key={index}
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              checked={index === stars - 1}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
