import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaSpotify,
  FaTiktok,
  FaLinkedin,
  FaGoogle,
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";

interface SocialIconProps {
  iconName?: string;
  className?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ iconName, className }) => {
  switch (iconName?.toLowerCase()) {
    case "instagram":
    
      return <FaInstagram className={className} />;
    case "facebook":
      return <FaFacebook className={className} />;
    case "twitter":
      return <FaTwitter className={className} />;
    case "spotify":
      return <FaSpotify className={className} />;
    case "tiktok":
      return <FaTiktok className={className} />;
    case "linkedin":
      return <FaLinkedin className={className} />;
    case "google":
      return <FaGoogle className={className} />;
    case "telegram":
      return <FaTelegram className={className} />;
    case "discord":
      return <FaDiscord className={className} />;
    case "snapchat":
      return <FaSnapchat className={className} />;
    case "twitch":
      return <FaTwitch className={className} />;
    case "youtube":
      return <FaYoutube className={className} />; 
    default:
      return null;
  }
};

export default SocialIcon;