import React, { useState, useEffect } from "react";
import useLanguage from "@/hooks/useLanguage";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { Slide, Dialog, Divider } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Form({ onClose }) {
  const [title, setTitle] = useState({ th: "", en: "" });
  const [description, setDescription] = useState({ th: "", en: "" });
  const [forms, setForms] = useState([]);
  const [form, setForm] = useState({
    label: { th: "", en: "" },
    description: { th: "", en: "" },
    type: "",
    required: false,
    multiple: false,
    options: [],
    order: 0,
    active: true,
  });
  const [openForm, setOpenForm] = useState(false);

  const { t, lang } = useLanguage();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row bg-orange-500 items-center justify-between w-full p-2">
        <div className="flex flex-row items-center gap-2">
          <IoIosArrowBack
            className="text-2xl text-white cursor-pointer"
            onClick={() => onClose()}
          />
          <h2 className="text-2xl font-bold text-white">
            {lang["create_form"]}
          </h2>
        </div>
        <IoClose
          className="text-2xl text-white cursor-pointer"
          onClick={() => onClose()}
        />
      </div>

      {/* Form */}
      <div className="flex flex-col p-4 w-full gap-2">
        <div>
          <label htmlFor="title">
            {lang["title"]}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-row items-center gap-2">
            <span>TH:</span>
            <input
              type="text"
              id="title.th"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={title.th}
              onChange={(e) => setTitle({ ...title, th: e.target.value })}
              placeholder={lang["title"]}
              required
            />
            <span>EN:</span>
            <input
              type="text"
              id="title.en"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={title.en}
              onChange={(e) => setTitle({ ...title, en: e.target.value })}
              placeholder={lang["title"]}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="description">{lang["description"]}</label>
          <div className="flex flex-row gap-2">
            <span>TH:</span>
            <textarea
              type="text"
              id="description.th"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={description.th}
              onChange={(e) =>
                setDescription({ ...description, th: e.target.value })
              }
              placeholder={lang["description"]}
              rows={4}
            />
            <span>EN:</span>
            <textarea
              type="text"
              id="description.en"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              value={description.en}
              onChange={(e) =>
                setDescription({ ...description, en: e.target.value })
              }
              placeholder={lang["description"]}
              rows={4}
            />
          </div>
        </div>
        <Divider flexItem textAlign="left" sx={{ my: 2 }}>
          <h3 className="text-center font-bold">{lang["form"]}</h3>
        </Divider>
        <div>
          <button
            type="button"
            onClick={() => setOpenForm(openForm ? false : true)}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
          >
            {openForm ? lang["cancel"] : lang["create"]}
          </button>
          {/* form */}
          <div className="mt-4">
            {forms && forms.legth > 0 ? (
              forms.map((item, index) => {
                <div key={index} className="flex flex-row items-center gap-2">
                  <p>{index + 1}</p>
                </div>;
              })
            ) : (
              <div>
                <p>{lang["no_data"]}</p>
              </div>
            )}
          </div>
          {/* Open Form */}
          {openForm && (
            <div className="flex flex-col w-full border border-gray-200 rounded-lg shadow-lg p-4 mt-5 gap-2">
              <div>
                <label htmlFor="label">{lang["label"]}</label>
                <div className="flex flex-row items-center gap-2">
                  <span>TH:</span>
                  <input
                    name="label.th"
                    id="label.th"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    type="text"
                    value={form.label.th}
                    onChange={(e) =>
                      setForm({ ...form, label: { th: e.target.value } })
                    }
                    placeholder={lang["label"]}
                  />
                  <span>EN:</span>
                  <input
                    name="label.en"
                    id="label.en"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    type="text"
                    value={form.label.en}
                    onChange={(e) =>
                      setForm({ ...form, label: { en: e.target.value } })
                    }
                    placeholder={lang["label"]}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description">{lang["description"]}</label>
                <div className="flex flex-row gap-2">
                  <span>TH:</span>
                  <textarea
                    type="text"
                    id="description.th"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={form.description.th}
                    onChange={(e) =>
                      setForm({ ...form, description: { th: e.target.value } })
                    }
                    placeholder={lang["description"]}
                    rows={4}
                  />
                  <span>TH:</span>
                  <textarea
                    type="text"
                    id="description.en"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={form.description.en}
                    onChange={(e) =>
                      setForm({ ...form, description: { en: e.target.value } })
                    }
                    placeholder={lang["description"]}
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex flex-row items-end gap-4 w-full">
                <div>
                  <label htmlFor="type">{lang["type"]}</label>
                  <select
                    name="type"
                    id="type"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="">{lang["select"]}</option>
                    <option value="text">{lang["text"]}</option>
                    <option value="textarea">{lang["textarea"]}</option>
                    <option value="date">{lang["date"]}</option>
                    <option value="select">{lang["select"]}</option>
                    <option value="checkbox">{lang["checkbox"]}</option>
                    <option value="radio">{lang["radio"]}</option>
                    <option value="upload">{lang["upload"]}</option>
                  </select>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input type="checkbox" name="required" id="required" />
                  <label htmlFor="required">{lang["required"]}</label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
