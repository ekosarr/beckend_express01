import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Table } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';


function Jurusan() {
  const [jurusan, setJurusan] = useState([]);

  useEffect(() => {
    fetchData();

  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/jrs");
      setJurusan(response.data.data);
    } catch (error) {
      console.error("Kesalahan: ", error);
    }
  };

    const [show, setShow] = useState(false);
    const handleClose = () => {
    console.log("Modal is closing");
    setShow(false);
    };
    const handleShow = () => setShow(true);

    const [nama_jurusan, setNama_jurusan] = useState("");
    const [validation, setValidation] = useState({});    
    const navigate = useNavigate();

    const handleNama_jurusanChange = (e) => {
        setNama_jurusan(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            nama_jurusan: nama_jurusan
        };
 
        try {
          await axios.post("http://localhost:3000/api/jrs/store", formData);
          navigate("/jrsn");
          fetchData();
        } catch (error) {
          console.error("Kesalahan: ", error);
          setValidation(error.response.data);
        }
      };

    //   update
    const [editData, setEditData] = useState({
        id_j: null,
        nama_jurusan: '',
    });
    
    const [showEditModal, setShowEditModal] = useState(false);
    
    const handleShowEditModal = (data) => {
        setEditData(data);
        setShowEditModal(true);
        setShow(false);
    };
    
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditData({
            id_j: null,
            nama_jurusan: '',
        });
    };
    
    const handleEditDataChange = (field, value) => {
        setEditData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        formData.append('id_j', editData.id_j);
        formData.append('nama_jurusan', editData.nama_jurusan);
    
        try {
            await axios.patch(`http://localhost:3000/api/jrs/update/${editData.id_j}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            navigate('/jrsn');
            fetchData();
            setShowEditModal(false);
        } catch (error) {
            console.error('Kesalahan:', error);
            setValidation(error.response.data);
        }
    };
    
    const handleDelete = (id_j) => {
        axios
            .delete(`http://localhost:3000/api/jrs/delete/${id_j}`)
            .then((response) => {
                console.log('Data berhasil dihapus');
                // Hapus item dari array data jurusan
                const updatedJurusan = jurusan.filter((item) => item.id_j !== id_j);
                setJurusan(updatedJurusan); // Perbarui state dengan data yang sudah diperbarui
            })
            .catch((error) => {
                console.error('Gagal menghapus data:', error);
                alert('Gagal menghapus data. Silakan coba lagi atau hubungi administrator.');
            });
    };
    
      

  return (
    <Container>
      <Row>
        <Col>
          <h2>Data Jurusan</h2>
          <Button  variant="primary" onClick={handleShow}>Tambah </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Nama Jurusan</th>
          </tr>
        </thead>
        <tbody>
          {jurusan.map((jrs, index) => (
            <tr key={jrs.id}>
              <td>{index + 1}</td>
              <td>{jrs.nama_jurusan}</td>
              <td> 
                <button onClick={() => handleShowEditModal(jrs)} className='btn btn-sm btn-info'> Edit </button>
                <td> 
                    <button onClick={() => handleDelete(jrs.id_j)} className='btn btn-sm btn-danger' >Hapus</button>
                </td>
              </td>

            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nama Jurusan:</label>
              <input
                type="text"
                className="form-control"
                value={nama_jurusan}
                onChange={handleNama_jurusanChange}
              />
            </div>
            <button
              onClick={handleClose}
              type="submit"
              className="btn btn-primary"
            >
              Kirim
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Data</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label className="form-label">Nama Jurusan:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editData ? editData.nama_jurusan : ''}
                      onChange={(e) => handleEditDataChange('nama_jurusan', e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Simpan Perubahan
                  </button>
                </form>
              </Modal.Body>
            </Modal>

    </Container>
  );
}

export default Jurusan;
