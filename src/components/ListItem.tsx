import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaPlay } from 'react-icons/fa';

interface ListItemProps {
  image: string;
  name: string;
  href: string;
  onMouseLeave?: () => void;
  onMouseMove?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ image, name, href, onMouseMove, onMouseLeave }) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(href)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative group flex items-center rounded-md overflow-hidden gap-x-4 bg-neutral-100/10 hover:bg-neutral-100/20 transition pr-4"
    >
      <div className="relative min-h-[64px] min-w-[64px]">
        <Image src={image} className="object-cover" alt="" fill />
      </div>
      <p className="font-medium truncate py-5 text-white">{name}</p>
      <div className="absolute transition opacity-0 rounded-full flex items-center justify-center bg-green-500 p-4 drop-shadow-md right-5   group-hover:opacity-100 hover:scale-110">
        <FaPlay className="text-black " />
      </div>
    </button>
  );
};

export default ListItem;