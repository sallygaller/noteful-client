import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import PropTypes from "prop-types";
import StoreContext from "../StoreContext";
import config from "../config";
import "./Note.css";

class Note extends React.Component {
  static defaultProps = {
    onDeleteNote: () => {},
  };

  static contextType = StoreContext;

  deleteNoteRequest = (noteId, cn) => {
    fetch(config.API_ENDPOINT_NOTES + `/${noteId}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok)
          return response.json().then((error) => Promise.reject(error));
        return response.json();
      })
      .then((data) => {
        cn(noteId);
      })
      .catch((error) => {
        console.error({ error });
      });
  };

  render() {
    const { title, id, modified } = this.props;
    return (
      <div>
        <div className="group">
          <p
            style={{
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            <Link aria-label={title} to={`/note/${id}`}>
              {title}
            </Link>
          </p>
          <Link to={`/edit/note/${id}`}>
            <button
              type="button"
              aria-label="Edit Note Button"
              className="Note-button"
            >
              Edit
            </button>
          </Link>
          <button
            aria-label="Delete button"
            className="Note-button"
            type="button"
            onClick={() =>
              this.deleteNoteRequest(id, StoreContext.deleteNoteRequest)
            }
          >
            Delete
          </button>
        </div>
        <p className="Note-modified">
          Date modified: {format(new Date(modified), "PPpp")}
        </p>
      </div>
    );
  }
}

Note.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  modified: PropTypes.string.isRequired,
};

export default Note;