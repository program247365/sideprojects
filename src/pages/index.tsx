import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
// import Image from "next/image";
type domain = {
  id: string;
  url: string;
};

function App() {
  const [domains, setDomains] = useState([]);

  const [isFormShowing, setIsFormShowing] = useState(false);

  const showForm = (isFormShowing) => {
    setIsFormShowing(!!isFormShowing);
  };

  useEffect(() => {
    get_domains();
  }, []);

  async function get_domains(): Promise<domains> {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const domains = await invoke("get_domains");
    setDomains(domains);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center align-center">
        <div className="flex flex-row items-center justify-between w-full pb-6">
          <input
            className="border border-[#E5E7EB] p-2 rounded-lg w-full mr-2"
            placeholder="Search projects..."
          />
        </div>
        <hr className="py-2" />

        <table className="w-full mb-4">
          {domains &&
            domains.map((d) => {
              return (
                <tr
                  key={d!.id}
                  className="flex flex-row justify-items-center items-center h-16 justify-between p-4 rounded-lg"
                >
                  <td className="w-full">
                    <a className="w-full">{d!.url}</a>
                    <p className="w-full">Expires in 165 days</p>
                  </td>
                </tr>
              );
            })}
        </table>
        <hr className="py-2" />
        <button
          onClick={get_domains}
          className="w-full h-[40px] bg-[#18DC5A] rounded-lg text-sm text-white font-semibold hover:bg-green-500"
        >
          Add A Side Project to Track
        </button>
      </div>
    </div>
  );
}

export default App;
