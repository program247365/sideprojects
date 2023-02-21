import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [domains, setDomains] = useState([]);
  const [url, setUrl] = useState("");
  const originalList = domains;

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);

    const filteredDomains = domains.filter((d) => {
      d.url.toLowerCase().includes(value.toLowerCase());
      return d.url.includes(value);
    });

    if (value === "") {
      const domains = await invoke("get_domains");
      setDomains(domains);
    } else {
      setDomains(filteredDomains);
    }
  };

  async function get_domains(): Promise<typeof domains> {
    const domains = await invoke("get_domains");
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
    <div className="p-4 pt-[40px]">
      <div data-tauri-drag-region className="titlebar"></div>
      <div className="flex flex-col justify-center align-center">
        <div className="flex flex-row items-center justify-between w-full pb-6">
          <input
            type="text"
            value={inputValue}
            autoCapitalize="off"
            autoComplete="off"
            onChange={handleInputChange}
            className="border border-[#E5E7EB] p-2 rounded-lg w-full mr-2"
            placeholder="Search projects..."
          />
        </div>
        <div className="pt-4 pb-4 w-full mb-4 h-[500px] overflow-y-scroll no-scrollbar">
          {domains &&
            domains.map((d) => {
              return (
                <div
                  key={d!.id}
                  className="flex flex-row justify-items-center items-center h-16 justify-between p-4 rounded-lg"
                >
                  <span className="w-full">
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
                  </span>
                </div>
              );
            })}
        </div>
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
