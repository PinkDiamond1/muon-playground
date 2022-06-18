import { useEffect, useRef, useState } from "react"

export const useOutSideClick = () => {
    const ref = useRef(null)
    const [visible, setVisible] = useState()

    const handelClickOutSide = (event) => {
        if (ref.current && !ref.current.contains(event.target)) setVisible(false)
    }

    useEffect(() => {
        document.addEventListener("click", handelClickOutSide, true)
        return () => {
            document.removeEventListener('click', handelClickOutSide, true)
        }
    }, [ref])

    return { visible, setVisible, ref }
}