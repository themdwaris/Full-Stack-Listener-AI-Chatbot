

const Modal = ({onClose,children}) => {
  
  return (
    <div className='fixed w-full inset-0 z-50 bg-black/40 flex items-center justify-center p-4' onClick={onClose}>
        {children}
    </div>
  )
}

export default Modal