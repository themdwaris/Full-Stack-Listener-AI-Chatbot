import React from 'react'

const Loader = ({className}) => {
  return (
    <div
  className={`${className} border-3 border-t-[var(--text-main)] border-gray-300 rounded-full animate-spin`}
></div>

  )
}

export default Loader