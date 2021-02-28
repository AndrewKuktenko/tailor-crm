import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import {
  Upload,
  Button,
  Select,
} from 'antd';
import { importFilePreSigned, createImport, clearImport } from './data/actions/import';
import { importPreprocessSelector, baseImportSelector } from './data/selectors/import';
import './App.css';

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

    dispatch(createImport(data, () => {
      dispatch(clearImport());
    }, () => {}));
  }, [dispatch, importData]);

  const renderUploadState = () => {
    if (loading) return 'Loading...';
    if (preprocessResult) {
      return (
        <>
          <Button onClick={addImport}>{`Upload file ${get(preprocessResult, 'originalName')}`}</Button>
        </>
      );
    }
    return 'Select your file';
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
      <header className="App-header" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Select disabled={get(importData, 'preprocess.fileUrl')} style={{ margin: 10 }} value={source} defaultValue="patient" onChange={setSource}>
          <Select.Option value="patient">Patient</Select.Option>
          <Select.Option value="hospital">Hospital</Select.Option>
        </Select>
        <Dragger
          style={{ padding: 10 }}
          name="file"
          accept="text/csv"
          multiple={false}
          customRequest={uploadRequestHandler}
          disabled={loading || !!preprocessResult}
          showUploadList={false}
        >
          { renderUploadState() }
        </Dragger>
      </header>
    </div>
  );
}

export default App;
