export default function isOpen(state={}, action){
    switch(action.type){
        case "IS_OPEN":

            return {
                    isOpen: action.payload.isOpen,
                }
            
        default:
            return state
        }
}