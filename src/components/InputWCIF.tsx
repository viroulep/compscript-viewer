import { Dispatch, SetStateAction, useState } from "react";
import { Competition } from "@wca/helpers";

export default function ImportWCIF({
  setWcif,
} : {
  setWcif: Dispatch<SetStateAction<Competition | undefined>>,
}) {

  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const loadWcifHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => e.target && setWcif(JSON.parse(e.target.result as string));
    fileReader.onerror = () => console.error('Error loading the json file');
    const files = event.target.files;
    if (files) {
      fileReader.readAsText(files[0]);
    }
  };

  // http://localhost:3000/api/v0/competitions/Euro2024/wcif/public
  // https://www.worldcubeassociation.org/api/v0/competitions/CubingUSANationals2023/wcif/public

  const featchLoadWCIF = () => {
    setBusy(true);
    fetch(url)
      .then(response => response.json())
      .then(json => setWcif(json))
      .catch(e => console.error(e))
      .finally(() => setBusy(false));
  };

  if (busy) {
    return (<p>Please wait while it&apos;s loading...</p>)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <input
        accept=".json"
        id="button-wcif"
        type="file"
        onChange={loadWcifHandler}
      />
      <input
        type="text"
        placeholder="Public WCIF url (eg: https://www.worldcubeassociation.org/api/v0/competitions/COMPID/wcif/public)"
        id="wcif-url"
        value={url}
        onChange={e => setUrl(e.target.value)}
      />
      <button
        onClick={featchLoadWCIF}
      >
        Fetch and load WCIF
      </button>
    </div>
  );
}
