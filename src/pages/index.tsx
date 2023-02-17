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
    console.log(Date.now(), "domains", domains, domains.length);
    setDomains(domains);

    return domains;
  }

  async function add_domain(url: string): Promise<typeof domain> {
    const domain = await invoke("insert_domain", { domain: { url: url } });
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
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col justify-center align-center">
        <div className="flex flex-row items-center justify-between w-full pb-6">
          <input
            className="border border-[#E5E7EB] p-2 rounded-lg w-full mr-2"
            placeholder="Search projects..."
          />
        </div>
        <table className="w-full h-[500px] overflow-auto mb-4">
          <tbody>
            {domains &&
              domains.map((d) => {
                return (
                  <tr
                    key={d!.id}
                    className="flex flex-row justify-items-center items-center h-16 justify-between p-4 rounded-lg"
                  >
                    <td className="w-full">
                      <a
                        className="w-full color-[#010101] font-bold text-2xl tracking-wide group text-[#010101] transition-all duration-300 ease-in-out"
                        href={`https://${d!.url}`}
                        rel="noopener"
                        target="_blank"
                      >
                        <span className="bg-left-bottom bg-gradient-to-r from-green-500 to-green-500 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out">
                          {d!.url}
                        </span>
                      </a>
                      <p className="w-full font-light text-[#8D8D8D]">
                        Expires in 165 days
                      </p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
