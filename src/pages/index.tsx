import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
type domain = {
  id: string;
  url: string;
};

function App() {
  const [domains, setDomains] = useState([]);
  const [url, setUrl] = useState("");

  async function get_domains(): Promise<typeof domains> {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    const domains = await invoke("get_domains");
    // TODO: fix this TS error
    setDomains(domains);

    return domains;
  }

  async function add_domain(url: string): Promise<typeof domain> {
    const domain = await invoke("insert_domain", { domain: { id: 4, url } });
    setDomains([...domains, domain]);

    return domains;
  }

  const createDomain = async () => {
    const domains = await add_domain(url);
    // logic to create a domain from the entered URL
  };

  //  const [isFormShowing, setIsFormShowing] = useState(false);

  // const showForm = (isFormShowing) => {
  //    setIsFormShowing(!!isFormShowing);
  //  };

  useEffect(() => {
    get_domains();
  }, [domains, get_domains]);

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
          <tbody>
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
          </tbody>
        </table>
        <hr className="py-2" />
        <form>
          <label>
            URL:
            <input
              className="border border-[#E5E7EB] p-2 rounded-lg w-full mr-2"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </label>
          <button type="submit" onClick={createDomain}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
