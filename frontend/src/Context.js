import React, {useState, useEffect } from "react"
const Context = React.createContext()

function ContextProvider(props) {

    const [ roomCode, setRoomCode ] = useState(null)

    const removeRoomCode = () => {
        setRoomCode(null)
    }

    useEffect( () => {

        const fetchMyRoom = async () => {
            fetch('/api/user-in-room')
                .then(res => res.json())
                .then(data => setRoomCode(data.code))
                .catch(err => console.log(err))
        }
        fetchMyRoom()

    }, [])

    return (
        <Context.Provider
            value={{
                    roomCode, removeRoomCode
                }}
        >
            {props.children}
        </Context.Provider>
    )
}



export {ContextProvider, Context}
