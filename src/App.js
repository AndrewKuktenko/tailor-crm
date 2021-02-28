import './App.css';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import {
  Upload,
  Button,
  Select,
} from 'antd';
import { importFilePreSigned, createImport } from './data/actions/import';
import { importPreprocessSelector, baseImportSelector } from './data/selectors/import';

const { Dragger } = Upload;

function App() {
  const dispatch = useDispatch();
  const preprocessResult = useSelector(importPreprocessSelector);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('patient');

  const importData = useSelector(baseImportSelector);

  const addImport = useCallback(() => {
    const fileName = get(importData, 'settings.fileName');

    const data = {
      name: fileName || get(importData, 'settings.name'),
      dataFileUrl: get(importData, 'preprocess.fileUrl'),
      source,
      type: get(importData, 'settings.type'),
    };


    dispatch(createImport(data, () => {}, () => {}));
  }, [dispatch, importData]);

  const renderUploadState = () => {
    if (loading) return 'Loading...';
    if (preprocessResult) {
      return (
        <>
          <Button onClick={addImport}>{`Start Import ${get(preprocessResult, 'originalName')}`}</Button>
        </>
      );
    }
    return 'Load your file';
  };

  const uploadRequestHandler = useCallback((file) => {
    dispatch(importFilePreSigned({
      file,
      onError: () => setLoading(false),
      onSuccess: () => setLoading(false),
    }));
    setLoading(true);
  }, [dispatch]);

  return (
    <div className="App">
      <header className="App-header" style={{ display: "flex", flexDirection: 'column', justifyContent: 'center' }}>
        <Select style={{ margin: 10 }} value={source} defaultValue="patient" onChange={setSource}>
          <Option value="patient">Patient</Option>
          <Option value="hospital">Hospital</Option>
        </Select>
        <Dragger
          style={{ padding: 10 }}
          name="file"
          accept="text/csv"
          multiple={false}
          customRequest={uploadRequestHandler}
          disabled={loading || !!preprocessResult}
        >
          { renderUploadState() }
        </Dragger>
      </header>
    </div>
  );
}

export default App;
