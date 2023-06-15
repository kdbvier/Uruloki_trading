import { FiPlusCircle } from "react-icons/fi"
import { DefaultButton } from "../ui/buttons/default.button"
import TextInput from "../ui/inputs/text-input"
import Modal from "../ui/modal/modal"
import ModalHeader from "../ui/modal/modal-header"
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { getConnectedAddress } from "@/helpers/web3Modal"

interface Props {
    onClose: () => void
}

/**
 * Creates a setup with the supplied name, and displays an error or success toast with the result
 * @param name The name of the setup
 * @param callback The function to run after attempting to create the setup
 */
async function submit(name: string, callback: () => void) {
    const creatorAddress = await getConnectedAddress()

    try {
        await axios.post("/api/strategies", {
            name,
            creatorAddress
        })
        toast.success("Successfully created setup")
    } catch (error: any) {
        toast.error(error?.response?.data?.message)
    }

    callback()
}

/**
 * A modal for allowing users to create a new setup
 * @param onClose A function which is called when the modal is closed
 * @returns 
 */
const CreateSetupModal: React.FC<Props> = ({onClose}) => {
    const [name, setName] = useState<string>("")
    
    return (
        <Modal
            color="[#1F2333]"
          >
            <ModalHeader 
              title="Create Setup" 
              onClose={onClose}
            />

            <TextInput 
              title="Name"
              onChange={(e)=>{setName(e.target.value)}}
            />

            <div className="w-40 mx-auto mt-10">
              <DefaultButton
                label="Create"
                callback={()=>{submit(name, onClose)}}
                filled={true}
                Icon={FiPlusCircle}
              />
            </div>
        </Modal>
    )
}

export default CreateSetupModal