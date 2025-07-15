import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppContext } from '../../context/appContext'
import ComponentCard from '../../components/common/ComponentCard'
import Badge from '../../components/ui/badge/Badge'
import Button from '../../components/ui/button/Button'
import { useModal } from '../../hooks/useModal'
import { Modal } from '../../components/ui/modal'
import Form from '../../components/form/Form'
import Label from '../../components/form/Label'
import Input from '../../components/form/input/InputField'
import Select from '../../components/form/Select'
import { getUpdatedFields } from '../../utils/updateFields'
import { toast } from 'react-toastify'
import { useLogOut } from '../../hooks/useLogOut'

function Payment() {
    const id = useParams()
    const { isOpen, openModal, closeModal } = useModal();
   const [paymentEdited, setPaymentEdited] = useState<any>();
    const [paymentDetails,setPaymentsDetails]=useState<any>();
    const logOut = useLogOut()
    const {URL} = useAppContext()
    const token = localStorage.getItem('token')
   const statusOptions = [
    {label:"PENDING",value:"PENDING"},
    {label:"SUCCESS",value:"SUCCESS"},
    {label:"FAILED",value:"FAILED"},

]
    async function getPaymentDetail(){
        
         try{
          if(!token){
                              toast.error("Not authorised")
                              logOut()
                          }
            
            const response = await fetch(`${URL}payment/${id.orgId}`,{
                method:"GET",
            headers:{ 'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    }
            })

            if(response.ok){
                const data = await response.json()
                console.log(data)
                setPaymentsDetails(data.payment)
            }
        }catch(e){
                toast.error(`error ${e}`)
        }
    }

    async function handleUpdate() {
        console.log(paymentEdited)

         try{
          if(!token){
              toast.error("Not authorised")
              logOut()
          }
            const input = getUpdatedFields(JSON.parse(JSON.stringify(paymentDetails)),JSON.parse(JSON.stringify(paymentEdited)))
            console.log('changed values',input)
            if(Object.keys(input).length < 1){
                toast.warning("Cannot perform action",{
                      position: "bottom-right",
                    })
                    closeModal()
                    return
            }
            const response = await fetch(`${URL}payment/update/${paymentDetails.paymentId}`,{
                method:"POST",
            headers:{ 'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`,
                    },
                    body:JSON.stringify(input)
            })

            if(response.ok){
                toast.success("Updated successfully")
                getPaymentDetail()
                closeModal()
            }
            else{
                toast.error("Error updating Status")
            }
        }catch(e){
                toast.error(`error ${e}`)
        }

    }
    useEffect(()=>{
       getPaymentDetail()
       setPaymentEdited(paymentDetails)
    },[])
  return (
    <div>
      <ComponentCard title='Payment Details'>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
             <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Organization Id
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {paymentDetails?.orgId}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Payment Id
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {paymentDetails?.paymentId}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Date
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {paymentDetails?.paymentDate}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Payment method
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {paymentDetails?.paymentMethod}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Payment Amount
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
               {paymentDetails?.paymentAmount}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Payment Status
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
             <Badge
                        size="sm"
                    color={
                      paymentDetails?.paymentStatus === "SUCCESS"
                        ? "success" :
                        paymentDetails?.paymentStatus === "PENDING"? "warning"
                        : "error"
                    }>
                      {paymentDetails?.paymentStatus}  
                    </Badge>
              </p>
            </div>
            </div>
            <div>
                    
        </div>
        </div>
        </div>
        
        
        </div>
        <Button
          onClick={()=>openModal()}
          updateBtn={true}
          className="flex w-full items-center justify-center gap-2 rounded-full border hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </Button>
      </ComponentCard>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Payment Information
            </h4>
            
          </div>
          <Form onSubmit={handleUpdate} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Update Status
                </h5>

                <div className="grid grid-cols-2 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-1 ">
                    <Label>Organization ID</Label>
                    <Input type="text" name="full_name" disabled  value={paymentDetails?.orgId}/>
                  </div>

                 

                  <div className="col-span-1 ">
                    <Label>Amount</Label>
                    <Input type="text" name="email" value={paymentDetails?.paymentAmount} disabled />
                  </div>
                  <div className="col-span-1 ">
                    <Label>Payment Status</Label>
                    <Select options={statusOptions} defaultValue={paymentEdited?.paymentStatus} onChange={(value:string)=>setPaymentEdited((prev:any)=>({...prev,paymentStatus:value}))} />
                  </div>

                 
                  
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={()=>closeModal()}>
                Close
              </Button>
              <Button size="sm" updateBtn={true} >
                Save Changes
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>

  )
}

export default Payment
