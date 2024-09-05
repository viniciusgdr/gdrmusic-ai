import { Header } from "@gdrmusic/components/Header";
import { Notify } from "@gdrmusic/components/Notify";
import { SongItemPage } from "@gdrmusic/components/SongItemPage";
import { Music } from "@gdrmusic/models/music";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BsStars } from "react-icons/bs";
import { TypeAnimation } from "react-type-animation";
const recommendations = [
  "Marília Mendonça - Graveto",
  "Marília Mendonça - Supera",
  "Marília Mendonça - Todo Mundo Vai Sofrer",
  "Simone & Simaria - Regime Fechado",
  "Simone & Simaria - Duvido Você Não Tomar Uma",
  "Simone & Simaria - Loka",
  "Gustavo Mioto - Com ou Sem Mim",
  "Gustavo Mioto - Anti-Amor",
  "Gustavo Mioto - Impressionando os Anjos",
  "Henrique & Juliano - Liberdade Provisória",
  "Henrique & Juliano - Até Você Voltar",
  "Henrique & Juliano - Aquela Pessoa",
  "Zé Neto & Cristiano - Largado às Traças",
  "Zé Neto & Cristiano - Notificação Preferida",
  "Zé Neto & Cristiano - Seu Polícia",
  "Maiara & Maraisa - Medo Bobo",
  "Maiara & Maraisa - 10%",
  "Maiara & Maraisa - Quem Ensinou Fui Eu",
  "Jorge & Mateus - Sosseguei",
  "Coldplay - Viva La Vida",
  "Coldplay - The Scientist",
  "Coldplay - Yellow",
  "Dj Arana - Montagem ANOS 2000",
  "Ghost - Mary On A Cross",
  "Tá rocheda - Os Barões da Pisadinha",
  "Os Barões da Pisadinha - Recairei",
  "Wesley Safadão - Camarote",
  "Wesley Safadão - Ar Condicionado no 15",
  "Anitta - Show das Poderosas",
  "Anitta - Vai Malandra",
  "Luan Santana - Acordando o Prédio",
  "Luan Santana - Te Esperando",
  "Gusttavo Lima - Apelido Carinhoso",
  "Gusttavo Lima - Balada",
  "Bruno & Marrone - Dormi na Praça",
  "Bruno & Marrone - Choram as Rosas",
  "Matheus & Kauan - Que Sorte a Nossa",
  "Matheus & Kauan - Te Assumi Pro Brasil",
  "Alok & Bruno Martini feat. Zeeba - Hear Me Now",
  "Imagine Dragons - Believer",
  "Imagine Dragons - Radioactive",
  "The Weeknd - Blinding Lights",
  "The Weeknd - Save Your Tears",
  "Justin Bieber - Peaches",
  "Ed Sheeran - Shape of You",
  "Dua Lipa - Don't Start Now",
  "Lady Gaga - Shallow",
];

const categories = [
  {
    title: "Sertanejo",
    image: "/images/categories/sertanejo.jpg",
    backgroundColor: "bg-pink-500",
  },
  {
    title: "Forró",
    image: "/images/categories/forro.webp",
    backgroundColor: "bg-yellow-500",
  },
  {
    title: "Funk",
    image: "/images/categories/funk.jpeg",
    backgroundColor: "bg-purple-500",
  },
  {
    title: "Rock",
    image: "/images/categories/rock.jpg",
    backgroundColor: "bg-blue-500",
  },
  {
    title: "Pop",
    image: "/images/categories/pop.webp",
    backgroundColor: "bg-green-500",
  },
  {
    title: "Eletrônica",
    image: "/images/categories/eletronica.webp",
    backgroundColor: "bg-red-500",
  },
  {
    title: "Hip Hop",
    image: "/images/categories/hiphop.webp",
    backgroundColor: "bg-indigo-500",
  },
  {
    title: "Samba",
    image: "/images/categories/samba.webp",
    backgroundColor: "bg-orange-500",
  },
  {
    title: "Pagode",
    image: "/images/categories/pagode.webp",
    backgroundColor: "bg-blue-500",
  },
  {
    title: "MPB",
    image: "/images/categories/mpb.webp",
    backgroundColor: "bg-green-500",
  },
  {
    title: "Outros",
    image: "/images/categories/outros.jpg",
    backgroundColor: "bg-gray-500",
  },
];

function Step1({
  setStep,
  setCategory,
  category,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  setCategory: Dispatch<SetStateAction<string>>;
  category: string;
}) {
  const recommendationMapped = recommendations
    .sort(() => Math.random() - 0.5)
    .flatMap((recommendation, index) => {
      return [recommendation, 1500];
    });

  return (
    <>
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold flex flex-row gap-3 items-center">
          Pesquisar por IA <BsStars size={23} />
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center w-full mt-6">
        <h1 className="text-white text-3xl font-light">
          O que você quer ouvir?
        </h1>
        <div className="flex flex-col w-full max-w-[722px] mt-4">
          <div className="flex flex-row justify-center text-white/90 text-[16px] md:text-xl font-extralight">
            <TypeAnimation
              sequence={recommendationMapped}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        </div>
        <div className="flex flex-col w-full mt-4">
          <h2 className="text-white text-2xl font-light mt-6">
            Selecione uma categoria
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full">
            {categories.map((category, index) => {
              return (
                <button
                  className={
                    "p-4 rounded-lg relative w-full h-32 flex overflow-hidden " +
                    category.backgroundColor
                  }
                  key={index}
                  onClick={() => {
                    if (category.title === "Outros") {
                      (document as any)
                        .getElementById("modal_category")
                        .showModal();
                    } else {
                      setCategory(category.title);
                      setStep(1);
                    }
                  }}
                >
                  <div className="text-white font-bold text-xl">
                    {category.title}
                  </div>
                  <div className="absolute bottom-2 right-4 transform translate-x-6 translate-y-6">
                    <Image
                      src={category.image}
                      alt="Music Image"
                      width={100}
                      height={140}
                      className="rounded-lg shadow-lg rotate-[24deg] object-cover min-h-24"
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <dialog id="modal_category" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg">
                Diga a categoria que deseja ouvir
              </h3>
              <input
                type="text"
                className="input input-primary w-full mt-2"
                placeholder="Digite a categoria"
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setCategory(e.target.value);
                  }
                }}
                value={category}
              />
              <button
                className="btn btn-primary mt-6 w-full"
                onClick={() => {
                  (document as any).getElementById("modal_category").close();
                  setStep(1);
                }}
              >
                Confirmar
              </button>
            </div>
          </dialog>
        </div>
      </div>
    </>
  );
}

function Step2({
  setStep,
  category,
}: {
  setStep: Dispatch<SetStateAction<number>>;
  category: string;
}) {
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startedLoadingTime, setStartedLoadingTime] = useState<number>(0);
  const [musics, setMusics] = useState<Music[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isLoading) {
      var interval = setInterval(() => {
        setStartedLoadingTime(startedLoadingTime + 1)
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setStartedLoadingTime(0);
    }

    return () => clearInterval(interval);
  }, [isLoading, startedLoadingTime])
  return (
    <>
      <div className="mb-2">
        <h1 className="text-white text-3xl font-semibold flex flex-row gap-3 items-center">
          Pesquisar por IA <BsStars size={23} />
        </h1>
        <button
          className="btn btn-primary w-full md:btn-wide"
          onClick={() => {
            setStep(0);
          }}
        >
          Voltar
        </button>
        <div className="flex flex-col justify-center items-center w-full mt-6">
          <h1 className="text-white text-3xl font-light">
            Me diga o que você quer ouvir de {category} 🎶
          </h1>

          <div className="flex flex-col w-full mt-4">
            <h2 className="text-white text-2xl font-light mt-6">
              Nos diga um artista ou uma música que você gosta.
            </h2>
            <input
              type="text"
              value={search}
              onChange={async (e) => {
                setSearch(e.target.value);
              }}
              placeholder="Marília Mendonça - Graveto"
              className="bg-transparent rounded-lg w-full h-12 px-4 text-white text-xl border border-white focus:outline-none"
            />
            <button
              className="btn btn-primary mt-6 w-full"
              onClick={async () => {
                setIsLoading(true);
                const request = await fetch("/api/musics/recommendations", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ query: search, gender: category }),
                });
                const data = await request.json();
                setIsLoading(false);
                if (request.status !== 200) {
                  setError(data.error);
                  Notify(data.error, "Algo deu errado");
                  return;
                }
                setMusics(data);
              }}
              disabled={isLoading || search.length === 0}
            >
              {isLoading ? (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="loading loading-spinner loading-sm"></div>
                  {startedLoadingTime && (
                    <div className="text-white text-sm text-center">
                      Pesquisando há {startedLoadingTime} segundos... A média é de 15 segundos.
                    </div>
                  )}
                </div>
              ) : (
                "Pesquisar"
              )}
            </button>
            {error && <div className="text-white text-lg mt-4">{error}</div>}
          </div>
        </div>

        {(musics.length && (
          <div className="mt-2 mb-7 px-6">
            <div className="flex items-center justify-between">
              <h1 className="text-white font-semibold text-2xl mt-4">
                Resultados
              </h1>
            </div>
            {musics.map((music, index) => (
              <SongItemPage
                key={index}
                music={music}
                index={index}
                onThis={false}
                ableToMove={false}
                showCircle={false}
                showMoreOptionsMobile={true}
                showOnHoverMobile={true}
                showMoreOptions={true}
              />
            ))}
          </div>
        )) ||
          null}
      </div>
    </>
  );
}

export default function Search() {
  const [step, setStep] = useState<number>(0);
  const [category, setCategory] = useState<string>("");

  return (
    <div className="bg-site bg-cover bg-no-repeat rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="min-h-full">
        {
          {
            0: (
              <Step1
                setStep={setStep}
                setCategory={setCategory}
                category={category}
              />
            ),
            1: <Step2 setStep={setStep} category={category} />,
          }[step]
        }
      </Header>
    </div>
  );
}

export function getStaticProps() {
  return {
    props: {
      BASE_URL: process.env.NEXTAUTH_URL,
    },
  };
}
