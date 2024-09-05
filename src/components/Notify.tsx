import { FaCartArrowDown } from 'react-icons/fa'
import { toast } from 'react-toastify'

export const Notify = (title: string, message: string, element?: React.JSX.Element) => {
  toast(
    <div>
      <h1 className="text-xl font-bold">{title}</h1>
      <p>{message}</p>
      {element}
      <p className="text-gray opacity-50 mt-2">Clique para fechar</p>
    </div>,
    {
      progressClassName: "toastProgress",
      position: "bottom-center",
      autoClose: 6000,
      style: {
        marginBottom: '5rem',
      },
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    }
  )
}