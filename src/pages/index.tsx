import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  const [isFormShowing, setIsFormShowing] = useState(false);

  const showForm = (isFormShowing) => {
    setIsFormShowing(!!isFormShowing);
  };

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <div className="flex justify-center align-center">
        <div className="flex flex-row items-center justify-between w-full pb-6">
          <input
            className="border border-[#E5E7EB] p-2 rounded-lg w-full mr-2"
            placeholder="Search projects..."
          />
        </div>
        <hr className="py-2" />
        <table className="w-full mb-4">
          <tr className="flex flex-row justify-items-center items-center h-16 justify-between p-4 rounded-lg">
            <td className="w-full">
              <a className="w-full">kbr.sh</a>
              <p className="w-full">Expires in 165 days</p>
            </td>
          </tr>
          <tr className="flex flex-row justify-items-center justify-between p-4">
            <td className="w-full">
              <a>samsshippingcompany.co</a>
              <p>Expires in 25 days</p>
            </td>
          </tr>
          <tr className="flex flex-row justify-items-center justify-between p-4">
            <td className="w-100">
              <a>thenextbigthing.com</a>
              <p>Expires in 125 days</p>
            </td>
          </tr>
          <tr className="flex flex-row justify-items-center justify-between p-4">
            <td className="w-100">
              <a>theriseoffrontendengineering.com</a>
              <p>Expires in 325 days</p>
            </td>
          </tr>
        </table>
        <button
          onClick={showForm}
          className="w-full h-[40px] bg-[#18DC5A] rounded-lg text-sm text-white font-semibold hover:bg-green-500"
        >
          Add A Side Project to Track
        </button>
      </div>
    </div>
  );
}

export default App;
