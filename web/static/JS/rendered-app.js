"use strict";

const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;
const Router = ReactRouterDOM.BrowserRouter;
const Switch = ReactRouterDOM.Switch;
const useParams = ReactRouterDOM.useParams;
const useContext = React.useContext;
const useState = React.useState;
const useEffect = React.useEffect;
const createContext = React.createContext;
const getMyInfo = ctext => {
  const [data, setData] = ctext;
  $.ajax({
    method: "POST",
    url: "/api/me",
    data: {
      csrfmiddlewaretoken: data.csrfmiddlewaretoken
    },
    success: r => {
      data.setIsReady(true);
      if (r.result) {
        setData({
          ...data,
          ["me"]: r.me
        });
      }
    },
    error: () => {
      showMsg("An unknown network error has occurred");
      setTimeout(getMyInfo, 10000);
    }
  });
};
const cleanMd = text => {
  return text.replace(/[#```>\*]+|<\w.*?>/g, "").replace(/\n+/g, " ");
};
const showMsg = (message, t = 5000) => {
  const container = $("#msgContainer");
  const msg = $("#msgContainer #msg");
  msg.text(message);
  container.removeClass("opacity-0 pointer-events-none");
  setTimeout(() => {
    container.addClass("opacity-0 pointer-events-none");
    msg.text("");
  }, t);
};

// some general function
const setTitle = e => {
  $("main").scrollTop(0);
  document.title = `${siteName} - ` + e.currentTarget.name;
};
const timeSince = date => {
  var seconds = Math.floor((new Date() - new Date(date).getTime()) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return "just now";
};
const nFormatter = num => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num;
};

// config marked
marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  }
});
const genColor = id => {
  const colors = ["red", "yellow", "orange", "amber", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"];
  const tuns = [400, 500, 700, 600, 800, 300];
  const randColor = colors[id % 17];
  const randTuns = tuns[id % 6];
  return `${randColor || "gray"}-${randTuns || 900}`;
};
const Loading = () => {
  return /*#__PURE__*/React.createElement("p", {
    className: "mt-8 text-center text-indigo-600 loading"
  }, "Loading...");
};
const Auth = ({
  page
}) => {
  const [data, setData] = useContext(Context);
  const about = {
    login: {
      url: "/accounts/login",
      help: "create new account",
      helpurl: "/accounts/join",
      about: "",
      apiurl: "/api/accounts/login"
    },
    join: {
      url: "/accounts/join",
      help: "already have account",
      helpurl: "/accounts/login",
      about: "",
      apiurl: "/api/accounts/join"
    }
  };
  const [formData, setFormData] = useState({
    csrfmiddlewaretoken: data.csrfmiddlewaretoken
  });
  const [status, setStatus] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const year = new Date().getFullYear();
  const [messages, setMessages] = useState({});
  const manageData = e => {
    setMessages({});
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const hanldeClickHelpBtn = e => {
    setTitle(e);
    setIsLoading(false);
    setMessages({});
    if (status == "join") {
      setStatus("login");
    } else if (status == "login") {
      setStatus("join");
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    setMessages({});
    if (status === "join") {
      setIsLoading(true);
      $.ajax({
        method: "POST",
        url: about["join"]["apiurl"],
        data: formData,
        success: r => {
          setIsLoading(false);
          if (r.result) {
            setStatus("finall");
          }
          setMessages(r);
        }
      });
    } else if (status === "login") {
      setIsLoading(true);
      $.ajax({
        method: "POST",
        url: about["login"]["apiurl"],
        data: formData,
        success: r => {
          setIsLoading(false);
          setMessages(r);
          if (r.result) {
            document.location = "/";
          }
        }
      });
    }
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "flex flex-col justify-between items-center w-full h-screen relative "
  }, /*#__PURE__*/React.createElement("span", {
    name: "tmp"
  }), status == "finall" ? /*#__PURE__*/React.createElement("div", {
    className: "p-4 flex items-center max-w-[20rem] min-w-[15rem] flex-col justify-center relative"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-medium my-4"
  }, "Successful !"), /*#__PURE__*/React.createElement("p", {
    className: "p2-1 pb-2 text-slate-600"
  }, "We send an email to you with reset code"), /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg "
  }, "Home")) : /*#__PURE__*/React.createElement("form", {
    className: "p-4 flex items-center max-w-[20rem] min-w-[15rem] flex-col justify-center relative",
    method: "POST",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-medium my-4"
  }, status[0].toUpperCase() + status.slice(1)), about[status]["about"] && /*#__PURE__*/React.createElement("p", {
    className: "p2-1 pb-2 text-slate-600"
  }, about[status]["about"]), /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "text",
    maxLength: "30",
    pattern: "^(?!.*\\.\\.)(?!.*\\.$)[^\\W][a-z0-9_.]{2,29}$",
    name: "username",
    placeholder: "Username",
    onChange: manageData,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.username || messages.__all__ ? "opacity-100" : "opacity-0"}`
  }, messages.username || messages.__all__ || "Invalid username. e.g user.n_ame")), /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "password",
    name: "password",
    placeholder: "Password",
    pattern: status === "join" ? ".{8,}" : ".*",
    onChange: manageData,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm ${status == "join" ? "text-red-500" : "text-white"} pt-1 ${messages.password2 ? "opacity-100" : "opacity-0"}`
  }, messages.password2 || (status == "join" ? "This password is too short." : "|"))), status == "join" ? /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "email",
    name: "email",
    placeholder: "Email",
    onChange: manageData,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.email ? "opacity-100" : "opacity-0"}`
  }, messages.email || "Invalid email. e.g email@exaple.com")) : "", /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: `px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg ${isLoading ? "opacity-50 cursor-wait" : ""}`
  }, status[0].toUpperCase() + status.slice(1) + (isLoading ? "..." : "")), /*#__PURE__*/React.createElement(Link, {
    name: "Reset password",
    onClick: setTitle,
    to: "/accounts/reset",
    className: `w-full text-center pt-4 text-indigo-600 hover:text-indigo-500 cursor-pointer`
  }, "Reset password"), /*#__PURE__*/React.createElement(Link, {
    name: status,
    onClick: hanldeClickHelpBtn,
    to: about[status]["helpurl"],
    className: `w-full text-center pt-2 text-indigo-600 hover:text-indigo-500 cursor-pointer`
  }, about[status]["help"])), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-600 py-4 text-sm opacity-100"
  }, `© ${hostName} ${year}. All right reserved.`));
};
const ResetPassword = ({
  isSent = false
}) => {
  const [data, setData] = useContext(Context);
  const [formData, setFormData] = useState({
    csrfmiddlewaretoken: data.csrfmiddlewaretoken
  });
  const [isLoading, setIsLoading] = useState(false);
  const year = new Date().getFullYear();
  const [messages, setMessages] = useState({});
  const [sent, setSent] = useState(isSent);
  const manageData = e => {
    setMessages({});
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const submit = () => {
    $.ajax({
      method: "POST",
      url: "/api/accounts/reset",
      data: formData,
      success: r => {
        console.log(r);
        setIsLoading(false);
        if (r.result) {
          setSent(true);
        }
        setMessages(r);
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      }
    });
  };
  useEffect(() => {
    if (data.me.id && !sent) {
      submit();
    }
  }, [1]);
  const handleSubmit = e => {
    e.preventDefault();
    setMessages({});
    setIsLoading(true);
    submit();
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "flex flex-col justify-between items-center w-full h-screen relative "
  }, /*#__PURE__*/React.createElement("span", {
    name: "tmp"
  }), /*#__PURE__*/React.createElement("form", {
    className: "p-4 flex items-center max-w-[20rem] min-w-[15rem] flex-col justify-center relative",
    method: "POST",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-medium my-4"
  }, sent ? "Sent" : "Reset Password"), /*#__PURE__*/React.createElement("p", {
    className: "p2-1 pb-2 text-slate-600"
  }, sent ? "We send an email to you with reset code" : "Reset you password with digital code"), sent ? "" : /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "text",
    maxLength: "30",
    pattern: "^(?!.*\\.\\.)(?!.*\\.$)[^\\W][a-z0-9_.]{2,29}$",
    name: "username",
    placeholder: "Username",
    onChange: manageData,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.username ? "opacity-100" : "opacity-0"}`
  }, messages.username || "Invalid username. e.g user.n_ame")), sent ? /*#__PURE__*/React.createElement(Link, {
    to: "/me/settings",
    className: "px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg "
  }, "Back") : /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: `px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg ${isLoading ? "opacity-50 cursor-wait" : ""}`
  }, "Submit", isLoading ? "..." : "")), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-600 py-4 text-sm opacity-100"
  }, `© ${hostName} ${year}. All right reserved.`));
};
const ChangePassword = ({
  isValid = false,
  token = ""
}) => {
  const [data, setData] = useContext(Context);
  const [formData, setFormData] = useState({
    csrfmiddlewaretoken: data.csrfmiddlewaretoken,
    token: token
  });
  const [isLoading, setIsLoading] = useState(false);
  const year = new Date().getFullYear();
  const [messages, setMessages] = useState({});
  const [changed, setChanged] = useState(!isValid);
  const manageData = e => {
    setMessages({});
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const submit = () => {
    $.ajax({
      method: "POST",
      url: "/api/accounts/reset-password",
      data: formData,
      success: r => {
        console.log(r);
        setIsLoading(false);
        if (r.result) {
          setChanged(true);
          setData({
            ...data,
            ["csrfmiddlewaretoken"]: r.csrfmiddlewaretoken
          });
        }
        setMessages(r);
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    setMessages({});
    setIsLoading(true);
    submit();
  };
  return /*#__PURE__*/React.createElement("main", {
    className: "flex flex-col justify-between items-center w-full h-screen relative "
  }, /*#__PURE__*/React.createElement("span", {
    name: "tmp"
  }), /*#__PURE__*/React.createElement("form", {
    className: "p-4 flex items-center max-w-[20rem] min-w-[15rem] flex-col justify-center relative",
    method: "POST",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl font-medium my-4"
  }, !isValid ? "Token expired" : changed ? "Done" : "Change Password"), /*#__PURE__*/React.createElement("p", {
    className: "p2-1 pb-2 text-slate-600"
  }, messages.message || (!isValid ? "This token is not valid." : changed ? "Your password successfully changed." : "")), changed ? "" : /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "password",
    name: "new_password1",
    placeholder: "New password",
    autoComplete: "new-password",
    onChange: manageData,
    pattern: ".{8,}",
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.new_password1 ? "opacity-100" : "opacity-0"}`
  }, messages.new_password1 || "Password is too short.")), changed ? "" : /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "password",
    name: "new_password2",
    placeholder: "Retype new password",
    autoComplete: "new-password",
    onChange: manageData,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.new_password2 ? "opacity-100" : "opacity-0"}`
  }, messages.new_password2 || ".")), changed || !isValid ? /*#__PURE__*/React.createElement(Link, {
    to: "/",
    className: "px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg "
  }, "Back") : /*#__PURE__*/React.createElement("button", {
    disabled: !(formData.new_password1 == formData.new_password2 && formData.new_password1),
    type: "submit",
    className: `px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg disabled:opacity-50 disabled:pointer-events-none ${isLoading ? "opacity-50 cursor-wait" : ""}`
  }, "Submit", isLoading ? "..." : "")), /*#__PURE__*/React.createElement("span", {
    className: "text-slate-600 py-4 text-sm opacity-100"
  }, `© ${hostName} ${year}. All right reserved.`));
};
const Navbar = ({
  state,
  loading
}) => {
  const [data, setData] = useContext(Context);
  return /*#__PURE__*/React.createElement("nav", {
    className: `bg-white fixed ${state == "auth" ? "hidden" : "flex"} w-full h-16 border-t-2 bottom-0 border-gray-200 sm:left-0 sm:h-full sm:w-16 sm:border-r-2 sm:flex-col sm:justify-between z-10`
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex m-2 text-2xl items-center justify-center "
  }, /*#__PURE__*/React.createElement("i", {
    className: "w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative"
  })) : /*#__PURE__*/React.createElement(Link, {
    onClick: setTitle,
    name: "Home",
    to: "/",
    className: "hidden sm:inline text-center text-3xl m-2 py-1 px-3 bg-black text-white rounded-xl font-bold"
  }, "\\"), loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex w-[83%] sm:w-full justify-around sm:justify-start sm:flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-3 text-2xl flex items-center justify-center "
  }, /*#__PURE__*/React.createElement("i", {
    className: "h-full sm:w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative"
  })), /*#__PURE__*/React.createElement("div", {
    className: "m-3 text-2xl flex items-center justify-center "
  }, /*#__PURE__*/React.createElement("i", {
    className: "h-full sm:w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative"
  })), /*#__PURE__*/React.createElement("div", {
    className: "m-3 text-2xl flex items-center justify-center "
  }, /*#__PURE__*/React.createElement("i", {
    className: "h-full sm:w-full aspect-square rounded-xl bg-gray-200 overflow-hidden fadeInLoad relative"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: `flex w-${data.me.id ? "[83%]" : "full"} sm:w-full justify-around sm:justify-start sm:flex-col`
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/",
    onClick: setTitle,
    name: "Home",
    tooltip: "Home",
    className: `px-4 m-2 text-2xl flex items-center justify-center cursor-pointer sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${state == "Home" ? "text-gray-900" : "text-gray-500"}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-house${state == "Home" ? "-fill" : ""}`
  })), /*#__PURE__*/React.createElement(Link, {
    onClick: setTitle,
    name: "Search",
    to: "/search",
    tooltip: "Search",
    className: `px-4 m-2 text-2xl flex items-center justify-center cursor-pointer sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${state == "Search" ? "text-gray-900" : "text-gray-500"}`
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-search"
  })), /*#__PURE__*/React.createElement(Link, {
    name: data.me.id ? "Bookmarks" : "",
    onClick: e => data.me.id ? setTitle(e) : showMsg("Please login"),
    to: data.me.id ? "/bookmarks" : "",
    tooltip: "Bookmarks",
    className: `px-4 m-2 text-2xl flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${state == "Bookmarks" ? "text-gray-900" : "text-gray-500"}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-bookmarks${state == "Bookmarks" ? "-fill" : ""}`
  })), /*#__PURE__*/React.createElement(Link, {
    name: data.me.id ? "Write" : "",
    onClick: e => data.me.id ? setTitle(e) : showMsg("Please login"),
    to: data.me.id ? "/write" : "",
    tooltip: "Write",
    className: `px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${state == "Write" ? "text-gray-900" : "text-gray-500"}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-plus-circle${state == "Write" ? "-fill" : ""}`
  })), data.me.id ? /*#__PURE__*/React.createElement(Link, {
    name: "Settings",
    onClick: setTitle,
    to: "/me/settings",
    tooltip: "Settings",
    className: `px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900 ${state == "Settings" ? "text-gray-900" : "text-gray-500"}`
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-gear${state == "Settings" ? "-fill" : ""}`
  })) : ""), loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center h-full sm:h-auto sm:w-full aspect-square "
  }, /*#__PURE__*/React.createElement("div", {
    className: "m-3 w-full aspect-square rounded-full overflow-hidden bg-gray-200 relative fadeInLoad"
  })) : data.me.id ? /*#__PURE__*/React.createElement(Link, {
    name: "Me",
    onClick: setTitle,
    to: "/me",
    tooltip: "Profile",
    className: "flex items-center justify-center h-full sm:h-auto sm:w-full aspect-square sm:after:whitespace-pre sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)] focus-visible:scale-110  focus-visible:text-gray-900"
  }, /*#__PURE__*/React.createElement("div", {
    className: `m-3 aspect-square rounded-full overflow-hidden border-2 ${state == "Me" ? "border-gray-900" : ""}`
  }, /*#__PURE__*/React.createElement("img", {
    src: data.me.profile,
    alt: `${data.me.name}'s image`,
    className: "w-full h-full cursor-pointer rounded-full border-2 border-white"
  }))) : /*#__PURE__*/React.createElement(Link, {
    name: "Sign in",
    onClick: setTitle,
    to: "/accounts/login",
    tooltip: "Join us",
    className: `px-4 m-2 text-2xl hidden sm:flex  items-center justify-center cursor-pointe sm:after:whitespace-pre sm:after:absolute sm:after:left-[100%] sm:after:py-1 sm:after:px-2 sm:after:bg-gray-900 sm:after:rounded-lg sm:after:text-base sm:after:flex sm:after:items-center sm:after:justify-center sm:after:border-[1px] sm:after:border-gray-700 sm:after:text-white sm:after:opacity-0 sm:after:-translate-y-3 hover:sm:after:translate-y-0 hover:sm:after:opacity-100 hover:sm:after:transition-all sm:after:transition-none after:pointer-events-none sm:after:content-[attr(tooltip)]`
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-person"
  })));
};
const Header = ({
  loading,
  state
}) => {
  const [data, setData] = useContext(Context);
  return /*#__PURE__*/React.createElement("header", {
    className: `bg-white fixed sm:hidden ${state == "auth" ? "hidden" : "flex"} w-full h-16 border-b-2 top-0 border-gray-200 items-center justify-between z-10`
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "h-8 w-28 text-xl mx-4 py-1 px-3 bg-gray-200  rounded-xl fadeInLoad overflow-hidden relative "
  }) : /*#__PURE__*/React.createElement(Link, {
    to: "/",
    name: "Home",
    onClick: setTitle,
    className: "text-xl mx-4 py-1 px-3 bg-black text-white rounded-xl font-extrabold"
  }, siteName), loading ? /*#__PURE__*/React.createElement("div", {
    className: "h-10 w-24 block px-8 py-2 bg-gray-200 text-white rounded-full mx-4 fadeInLoad overflow-hidden relative"
  }) : !data.me.id ? /*#__PURE__*/React.createElement(Link, {
    name: "Sign in",
    onClick: setTitle,
    to: "/accounts/login",
    className: "block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
  }, "Join") : state == "Write" ? "" : state == "Me" ? /*#__PURE__*/React.createElement(Link, {
    onClick: setTitle,
    to: "/me/settings",
    name: "Settings",
    className: "block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
  }, "Settings") : /*#__PURE__*/React.createElement(Link, {
    onClick: setTitle,
    to: "/write",
    name: "Write",
    className: "block px-8 py-2 bg-gray-900 text-white rounded-full mx-4 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all"
  }, "Write"));
};
const Tag = ({
  tag,
  loading = false,
  onClick = () => {}
}) => {
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fadeInLoad relative overflow-hidden rounded-full h-5 w-16 bg-gray-200 mr-2"
    });
  } else {
    return /*#__PURE__*/React.createElement(Link, {
      name: `# ${tag.name}`,
      onClick: e => {
        setTitle(e);
        onClick(tag.name);
      },
      to: `/t/${tag.name}`,
      className: `hover:underline focus-visible:underline mr-2 text-${genColor(tag.id)}`
    }, "#", /*#__PURE__*/React.createElement("span", {
      className: "text-gray-700"
    }, tag.name));
  }
};
const Following = ({
  user,
  loading
}) => {
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "fadeInLoad relative rounded-full overflow-hidden w-12 h-12 bg-gray-200 mr-3"
    });
  } else {
    return /*#__PURE__*/React.createElement(Link, {
      name: user.name,
      onClick: setTitle,
      to: `/@${user.username}`,
      className: `relative first:ml-0 mx-2 last:mr-0 ${user.haveNew ? "after:bg-indigo-600 after:border-2 after:border-white after:h-4 after:w-4 after:absolute after:bottom-0 after:right-0 after:rounded-full" : ""}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-full overflow-hidden w-12 h-12"
    }, /*#__PURE__*/React.createElement("img", {
      src: `${user.profile}`,
      alt: `${user.name}'s image`,
      className: "w-full h-full cursor-pointer"
    })));
  }
};
const Post = ({
  post = {},
  loading,
  onTitle = () => {},
  tagClick = () => {}
}) => {
  const [isBookmark, setIsBookmark] = useState(post.bookmark);
  const [data, setData] = useContext(Context);
  const bookmark = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/@${post.user.username}/${post.slug}/bookmark`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: post.id
        },
        success: r => {
          if (r.result) {
            setIsBookmark(!isBookmark);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "my-2 py-2 first:mt-1"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center fadeInLoad overflow-hidden relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: " w-8 h-8 rounded-full bg-gray-200 "
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-3 w-[15ch] sm:w-[25ch] lg:w-[50ch]  bg-gray-200 rounded-full h-4 "
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-200 mx-1"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: " bg-gray-200 rounded-full h-4 w-[7ch] "
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-200 mx-1 hidden sm:inline"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: " bg-gray-200 rounded-full h-4 w-[7ch] hidden sm:inline"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: `${post.user.profile}`,
    alt: `${post.user.name}'s image`,
    className: "w-8 h-8 rounded-full overflow-hidden"
  }), /*#__PURE__*/React.createElement(Link, {
    name: post.user.name,
    onClick: setTitle,
    to: data.me.id == post.user.id ? "/me" : `/@${post.user.username}`,
    className: "font-semibold ml-3 max-w-[15ch] sm:max-w-[25ch] lg:max-w-[50ch] truncate hover:underline focus-visible:underline"
  }, post.user.name), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 mx-1"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, timeSince(post.date)), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 mx-1 hidden sm:inline"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre hidden sm:inline"
  }, Math.ceil(cleanMd(post.text).split(" ").length / 200), " min read"))), loading ? /*#__PURE__*/React.createElement("div", {
    className: "body mt-2 fadeInLoad overflow-hidden relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-4 font-bold w-10/12   bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 h-3 w-full rounded-full bg-gray-200  overlfow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 h-3 w-1/2 rounded-full bg-gray-200  overlfow-hidden"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "body mt-2"
  }, /*#__PURE__*/React.createElement("h1", {
    dir: "auto",
    className: "text-2xl font-bold truncate hover:underline"
  }, /*#__PURE__*/React.createElement(Link, {
    name: post.title,
    onClick: e => {
      setTitle(e);
      onTitle(post.user.username, post.slug);
    },
    to: `/@${post.user.username}/${post.slug}`,
    className: "hover:underline focus-visible:underline"
  }, post.title)), /*#__PURE__*/React.createElement("p", {
    className: "mt-1",
    dir: "auto"
  }, cleanMd(post.text).slice(0, 150), "...")), loading ? /*#__PURE__*/React.createElement("div", {
    className: "tags flex mt-3 items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center whitespace-pre w-9/12 overflow-hidden  "
  }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Tag, {
    loading: true,
    key: i
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "tags flex mt-3 items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center whitespace-pre w-9/12 overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6"
  }, post.tags.map(tag => /*#__PURE__*/React.createElement(Tag, {
    tag: tag,
    key: tag.id,
    onClick: tagClick
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(`${window.location.origin}/@${post.user.username}/${post.slug}`);
      showMsg("Link copied");
    },
    className: "focus-visible:scale-110"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-link-45deg p-1 cursor-pointer mx-1"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: bookmark,
    className: "focus-visible:scale-110"
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-bookmark-${isBookmark ? "fill" : "plus"} p-1 cursor-pointer mx-1  `
  })))));
};
const Home = ({}) => {
  const [followings, setFollowings] = useState({
    items: [],
    hasNext: true
  });
  const [rec, setRec] = useState({
    items: [],
    hasNext: true
  });
  const [latests, setLatests] = useState({
    items: [],
    hasNext: true
  });
  const [followingUsers, setFollowingUsers] = useState({
    items: [],
    hasNext: true
  });
  const [tags, setTags] = useState({
    items: [],
    hasNext: true
  });
  const [state, setState] = useState("rec");
  const [data, setData] = useContext(Context);
  const getRec = () => {
    $.ajax({
      method: "POST",
      url: "/api/rec",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: rec.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = rec.items.concat(r.items);
          r["isReady"] = true;
          setRec(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getRec, 10000);
      }
    });
  };
  const getLatests = () => {
    $.ajax({
      method: "POST",
      url: "/api/latests",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: latests.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = latests.items.concat(r.items);
          r["isReady"] = true;
          setLatests(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getLatests, 10000);
      }
    });
  };
  const getFollowingUsers = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/followings",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: followingUsers.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = followingUsers.items.concat(r.items);
          r["isReady"] = true;
          setFollowingUsers(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getFollowingUsers, 10000);
      }
    });
  };
  const getTags = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: tags.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = tags.items.concat(r.items);
          r["isReady"] = true;
          setTags(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTags, 10000);
      }
    });
  };
  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setRec({
          ...r.rec,
          ["isReady"]: true
        });
        if (r.me) {
          setFollowingUsers({
            ...r.followings,
            ["isReady"]: true
          });
          setTags({
            ...r.tags,
            ["isReady"]: true
          });
          setData({
            ...data,
            ["me"]: r.me || {}
          });
        }
        data.setIsReady(true);
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      }
    });
  };
  useEffect(() => {
    getBase();
  }, [1]);
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (state == "rec") {
            getRec();
          } else if (state == "latests") {
            getLatests();
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [rec, latests]);
  useEffect(() => {
    const load = document.querySelector("#tagsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getTags();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [tags]);
  useEffect(() => {
    const load = document.querySelector("#followingUsersContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getFollowingUsers();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [followingUsers]);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, data.me.id ? /*#__PURE__*/React.createElement("div", {
    id: "tagsContainer",
    className: "overflow-auto ml-3 flex items-center whitespace-pre"
  }, tags.isReady ? tags.items.map(i => /*#__PURE__*/React.createElement(Tag, {
    tag: i,
    key: i.id
  })) : [1, 2, 3].map(i => /*#__PURE__*/React.createElement(Tag, {
    loading: true,
    key: i
  })), tags.hasNext && tags.isReady ? /*#__PURE__*/React.createElement("span", {
    className: "mx-4 text-xl loading"
  }, "...") : "") : "", data.me.id ? /*#__PURE__*/React.createElement("div", {
    id: "followingUsersContainer",
    className: "py-2 my-4 flex overflow-auto"
  }, followingUsers.isReady ? followingUsers.items.map(i => /*#__PURE__*/React.createElement(Following, {
    user: i,
    key: i.id
  })) : [1, 2, 3].map(i => /*#__PURE__*/React.createElement(Following, {
    loading: true,
    key: i
  })), followingUsers.hasNext && followingUsers.isReady ? /*#__PURE__*/React.createElement("div", {
    className: "h-12 w-12 text-xl loading px-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "m-auto"
  }, "...")) : "") : "", rec.isReady ? /*#__PURE__*/React.createElement("div", {
    className: "border-b-2 text-sm sm:text-base flex justify-between sm:block"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (rec.items.length == 0) {
        getRec();
      }
      setState("rec");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "rec" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "Explore"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (latests.items.length == 0) {
        getLatests();
      }
      setState("latests");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "latests" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "latests")) : /*#__PURE__*/React.createElement("div", {
    className: "border-b-2 text-sm sm:text-base flex justify-between sm:block"
  }, /*#__PURE__*/React.createElement("button", {
    className: "py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fadeInLoad relative rounded-full h-5 w-20 bg-gray-200"
  })), /*#__PURE__*/React.createElement("button", {
    className: "py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fadeInLoad relative rounded-full h-5 w-20 bg-gray-200"
  }))), /*#__PURE__*/React.createElement("div", {
    id: "postsContainer"
  }, state == "rec" && rec.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })), state == "latests" && latests.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })), (state == "rec" && rec.hasNext && rec.isReady || state == "latests" && latests.hasNext && latests.isReady) && /*#__PURE__*/React.createElement(Loading, null), (state == "rec" && !rec.isReady || state == "latests" && !latests.isReady) && [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  }))))));
};
const TagView = ({}) => {
  const [tag, setTag] = useState({});
  const [posts, setPosts] = useState({
    items: [],
    hasNext: true
  });
  const [data, setData] = useContext(Context);
  const [is404, setIs404] = useState(false);
  const url = useParams();
  const getTag = (name = url.name) => {
    $.ajax({
      method: "POST",
      url: `/api/t/${name}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setTag({
          ...r.tag,
          ["isReady"]: true
        });
        setPosts({
          ...r.posts,
          ["isReady"]: true
        });
        setData({
          ...data,
          ["me"]: r.me
        });
        data.setIsReady(true);
      },
      error: xhr => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
        }
      }
    });
  };
  const getPosts = () => {
    $.ajax({
      method: "POST",
      url: `/api/posts/${url.name}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      }
    });
  };
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getPosts();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts]);
  useEffect(() => {
    getTag();
  }, [1]);
  const follow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/follow/${tag.name}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: tag.id
        },
        success: r => {
          if (r.result) {
            setTag({
              ...tag,
              ["followed"]: !tag.followed
            });
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, is404 ? /*#__PURE__*/React.createElement(Page404, null) : /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, tag.isReady ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-${genColor(tag.id)} text-7xl sm:text-8xl mr-2 `
  }, "#"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-lg sm:text-xl "
  }, tag.name), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500"
  }, nFormatter(tag.followers), " followers"))), /*#__PURE__*/React.createElement("button", {
    onClick: follow,
    className: `py-1 px-3 rounded-full active:scale-[0.98] transition-all focus-visible:scale-110 ${tag.followed ? "text-indigo-500 border-2 border-indigo-500 bg-white" : "text-white bg-indigo-500"} `
  }, tag.followed ? "Unfollow" : "Follow")) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-200 text-7xl sm:text-8xl mr-2 "
  }, "#"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "h-5 bg-gray-200 rounded-full w-32"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 h-4 bg-gray-200 rounded-full w-16"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8"
  })), posts.isReady ? /*#__PURE__*/React.createElement("div", {
    className: "mt-8 border-b-2 border-gray-400 flex "
  }, /*#__PURE__*/React.createElement("button", {
    className: "py-2 px-3 border-b-2 border-gray-900 translate-y-[2px] "
  }, "Home")) : /*#__PURE__*/React.createElement("div", {
    className: "tm-4 border-b-2 flex "
  }, /*#__PURE__*/React.createElement("button", {
    className: "py-2 px-3 translate-y-[2px] border-b-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fadeInLoad relative rounded-full h-5 w-20 bg-gray-200"
  }))), /*#__PURE__*/React.createElement("div", {
    id: "postsContainer"
  }, posts.isReady ? posts.items.map(p => /*#__PURE__*/React.createElement(Post, {
    post: p,
    key: p.id,
    tagClick: getTag
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  })), posts.hasNext && posts.isReady ? /*#__PURE__*/React.createElement(Loading, null) : ""))));
};
const PeopleItem = ({
  user = {},
  inSearch,
  loading
}) => {
  const [data, setData] = useContext(Context);
  const [followed, setFollowed] = useState(user.followed);
  const follow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/follow/@${user.username}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: user.id
        },
        success: r => {
          if (r.result) {
            setFollowed(!followed);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-2 py-1"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center w-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("img", {
    className: "h-12 w-12 rounded-full m-1 bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col p-1 w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4 h-4 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-1/2 h-3 mt-1 bg-gray-200 rounded-full"
  }))) : /*#__PURE__*/React.createElement(Link, {
    name: user.name,
    onClick: setTitle,
    to: `/@${user.username}`,
    className: "flex items-center w-full"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.profile,
    alt: `${user.name}'s image`,
    className: "h-14 w-14 sm:h-16 sm:w-16 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-2 w-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl truncate"
  }, user.name), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, inSearch ? nFormatter(user.followers) + " Followers" : user.bio))), loading ? /*#__PURE__*/React.createElement("div", {
    className: "p-2 flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8"
  })) : /*#__PURE__*/React.createElement("button", {
    onClick: follow,
    className: `py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${followed ? "text-indigo-500 bg-white" : "text-white bg-indigo-500"} `
  }, followed ? "Unfollow" : "Follow"));
};
const TagItem = ({
  tag = {},
  loading
}) => {
  const [data, setData] = useContext(Context);
  const [followed, setFollowed] = useState(tag.followed);
  const follow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/follow/${tag.name}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: tag.id
        },
        success: r => {
          if (r.result) {
            setFollowed(!followed);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center my-2"
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center w-full overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-gray-200 text-6xl sm:text-7xl mr-2 `
  }, "#"), /*#__PURE__*/React.createElement("div", {
    className: "ml-2 w-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-full bg-gray-200 h-4 w-3/4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 rounded-full bg-gray-200 h-3 w-1/2"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center w-full"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-${genColor(tag.id)} text-6xl sm:text-7xl mr-2 `
  }, "#"), /*#__PURE__*/React.createElement("div", {
    className: "ml-2 w-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl truncate hover:underline "
  }, /*#__PURE__*/React.createElement(Link, {
    name: `# ${tag.name}`,
    onClick: setTitle,
    to: `/t/${tag.name}`,
    className: "hover:underline focus-visible:underline"
  }, tag.name)), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, nFormatter(tag.followers), " Followers"))), loading ? /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8"
  }) : /*#__PURE__*/React.createElement("button", {
    onClick: follow,
    className: `py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${followed ? "text-indigo-500  bg-white" : "text-white bg-indigo-500"} `
  }, followed ? "Unfollow" : "Follow"));
};
const SearchView = ({}) => {
  const [data, setData] = useContext(Context);
  const [state, setState] = useState("posts");
  const [time, setTime] = useState(null);
  const [topPosts, setTopPosts] = useState({
    items: [],
    hasNext: true
  });
  const [topUsers, setTopUsers] = useState({
    items: [],
    hasNext: true
  });
  const [topTags, setTopTags] = useState({
    items: [],
    hasNext: true
  });
  const [posts, setPosts] = useState({
    items: [],
    hasNext: true
  });
  const [tags, setTags] = useState({
    items: [],
    hasNext: true
  });
  const [users, setUsers] = useState({
    items: [],
    hasNext: true
  });
  const [searchValue, setSearchValue] = useState("");
  const getTopPosts = () => {
    $.ajax({
      method: "POST",
      url: "/api/top-posts",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topPosts.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = topPosts.items.concat(r.items);
          r["isReady"] = true;
          setTopPosts(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopPosts, 10000);
      }
    });
  };
  const getTopUsers = () => {
    $.ajax({
      method: "POST",
      url: "/api/top-users",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topUsers.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = topUsers.items.concat(r.items);
          r["isReady"] = true;
          setTopUsers(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopUsers, 10000);
      }
    });
  };
  const getTopTags = () => {
    $.ajax({
      method: "POST",
      url: "/api/top-tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topTags.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = topTags.items.concat(r.items);
          r["isReady"] = true;
          setTopTags(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopTags, 10000);
      }
    });
  };
  const search = () => {
    clearTimeout(time);
    if (searchValue.replace(/\s+/g, "").length) {
      setTime(setTimeout(() => {
        $.ajax({
          method: "POST",
          url: `/api/search-${state}`,
          data: {
            csrfmiddlewaretoken: data.csrfmiddlewaretoken,
            text: searchValue,
            page: posts.items.length / 15 + 1
          },
          success: r => {
            if (r.result) {
              if (state == "users") {
                r["isReady"] = true;
                setUsers(r);
              } else if (state == "tags") {
                r["isReady"] = true;
                setTags(r);
              } else if (state == "posts") {
                r["isReady"] = true;
                setPosts(r);
              }
            } else {
              showMsg("An unknown error has occurred");
            }
          },
          error: () => {
            showMsg("An unknown network error has occurred");
            setTimeout(search, 10000);
          }
        });
      }, 500));
    }
  };
  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/search",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setTopPosts({
          ...r.posts,
          ["isReady"]: true
        });
        setTopTags({
          ...r.tags,
          ["isReady"]: true
        });
        setTopUsers({
          ...r.users,
          ["isReady"]: true
        });
        setData({
          ...data,
          ["me"]: r.me || {}
        });
        data.setIsReady(true);
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      }
    });
  };
  useEffect(() => {
    getBase();
  }, [1]);
  useEffect(() => {
    search();
  }, [searchValue, state]);
  useEffect(() => {
    const load = document.querySelector("#searchContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (searchValue.replace(/\s+/g, "").length) {
            search();
          } else {
            if (state == "posts") {
              getTopPosts();
            } else if (state == "users") {
              getTopUsers();
            } else if (state == "tags") {
              getTopTags();
            }
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [topUsers, topTags, topPosts, posts, users, tags, state]);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-full w-full flex border-2 border-gray-300  px-2 "
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-search px-1 py-2 text-md sm:text-lg"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Search",
    onChange: e => setSearchValue(e.target.value),
    dir: "auto",
    className: "focus:border-0 text-lg sm:text-xl w-full mx-2"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mt-8 border-b-2 text-sm sm:text-base flex justify-between sm:block"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setState("posts");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "posts" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "Posts"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setState("users");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "users" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "Users"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setState("tags");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "tags" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "Tags")), /*#__PURE__*/React.createElement("div", {
    id: "searchContainer"
  }, searchValue.replace(/\s+/g, "") ? state == "posts" ? posts.isReady ? posts.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  })) : state == "users" ? users.isReady ? users.items.map(i => /*#__PURE__*/React.createElement(PeopleItem, {
    user: i,
    inSearch: true,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(PeopleItem, {
    loading: true,
    key: i
  })) : state == "tags" ? tags.isReady ? tags.items.map(i => /*#__PURE__*/React.createElement(TagItem, {
    tag: i,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(TagItem, {
    loading: true,
    key: i
  })) : "" : state == "posts" ? topPosts.isReady ? topPosts.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  })) : state == "users" ? topUsers.isReady ? topUsers.items.map(i => /*#__PURE__*/React.createElement(PeopleItem, {
    user: i,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(PeopleItem, {
    loading: true,
    key: i
  })) : state == "tags" ? topTags.isReady ? topTags.items.map(i => /*#__PURE__*/React.createElement(TagItem, {
    tag: i,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(TagItem, {
    loading: true,
    key: i
  })) : "", (state == "posts" && posts.hasNext && posts.isReady || state == "tags" && tags.hasNext && tags.isReady || state == "users" && users.hasNext && users.isReady || state == "posts" && topPosts.hasNext && topPosts.isReady || state == "tags" && topTags.hasNext && topTags.isReady || state == "users" && topUsers.hasNext && topUsers.isReady) && /*#__PURE__*/React.createElement(Loading, null))))));
};
const BookmarkView = ({}) => {
  const [bookmarks, setBookmarks] = useState({
    items: [],
    hasNext: true
  });
  const [data, setData] = useContext(Context);
  const getBookmarks = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/bookmarks",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: bookmarks.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = bookmarks.items.concat(r.items);
          r["isReady"] = true;
          setBookmarks(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBookmarks, 10000);
      }
    });
  };
  useEffect(() => {
    const load = document.querySelector("#bookmarksContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getBookmarks();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [bookmarks]);
  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/bookmarks",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        if (r.result) {
          setBookmarks({
            ...r.bookmarks,
            ["isReady"]: true
          });
          setData({
            ...data,
            ["me"]: r.me
          });
          data.setIsReady(true);
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      }
    });
  };
  useEffect(() => {
    getBase();
  }, [1]);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl border-b-2 border-gray-300 mb-2 py-2"
  }, "Bookmarks"), bookmarks.isReady ? /*#__PURE__*/React.createElement("div", {
    id: "bookmarksContainer"
  }, bookmarks.items.map(p => /*#__PURE__*/React.createElement(Post, {
    post: p,
    key: p.id
  })), bookmarks.hasNext && bookmarks.isReady ? /*#__PURE__*/React.createElement(Loading, null) : "") : /*#__PURE__*/React.createElement("div", null, [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  }))))));
};
const WriteView = ({}) => {
  const [data, setData] = useContext(Context);
  const [messages, setMessages] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const [crntTags, setCrntTags] = useState({
    items: [],
    hasNext: true
  });
  const [topTags, setTopTags] = useState({
    items: [],
    hasNext: true
  });
  const [srchTag, setSrchTag] = useState("");
  const [saved, setSaved] = useState(false);
  const [is404, setIs404] = useState(false);
  const url = useParams();
  const [post, setPost] = useState({
    csrfmiddlewaretoken: data.csrfmiddlewaretoken
  });
  const [apiPath, setApiPath] = useState(url.id ? `/api/write/${url.id}` : "/api/write");
  const getTopTags = () => {
    $.ajax({
      method: "POST",
      url: `/api/top-tags`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: topTags.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = topTags.items.concat(r.items);
          r["isReady"] = true;
          setTopTags(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getTopTag, 10000);
      }
    });
  };
  const getPost = () => {
    $.ajax({
      method: "POST",
      url: `/api/p/${url.id}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        if (r.result) {
          setSaved(true);
          setPost({
            ...r,
            ["csrfmiddlewaretoken"]: data.csrfmiddlewaretoken
          });
          window.history.pushState(null, null, "/write/" + r.id);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: xhr => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
          setTimeout(getPost, 10000);
        }
      }
    });
  };
  useEffect(() => {
    if (url.id) {
      getPost();
    }
    getTopTags();
    getMyInfo([data, setData]);
  }, [1]);
  const handleChange = e => {
    setSaved(false);
    setPost({
      ...post,
      ["date"]: new Date().getTime()
    });
    setPost({
      ...post,
      [e.target.name]: e.target.value
    });
  };
  const handleUpload = e => {
    showMsg("Processing...");
    const [file] = e.target.files;
    const pyload = new FormData();
    pyload.append("image", file);
    pyload.append("csrfmiddlewaretoken", data.csrfmiddlewaretoken);
    $.ajax({
      method: "POST",
      url: "/api/upload",
      data: pyload,
      contentType: false,
      processData: false,
      success: r => {
        if (r.result) {
          navigator.clipboard.writeText(r.link);
          showMsg("Image url copied");
        } else {
          showMsg(r.image || "An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const status = () => {
    $.ajax({
      method: "POST",
      url: `/api/write/${post.id}/status`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        id: post.id
      },
      success: r => {
        if (r.result) {
          setSaved(true);
          setPost({
            ...post,
            ["isPub"]: r.isPub
          });
          showMsg(`Successfully ${r.isPub ? "Published" : "Drafted"}`);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const deletePost = () => {
    $.ajax({
      method: "POST",
      url: `/api/delete/${post.id}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        if (r.result) {
          setSaved(false);
          setApiPath("/api/write");
          window.history.pushState(null, null, "/write");
          showMsg("Post deleted");
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const avTags = () => {
    const av = (srchTag.replace(/\W+/g, "").length || crntTags.items.length ? crntTags : topTags).items.filter(i => !(post.tags || []).includes(i) && i.name.toLowerCase().startsWith(srchTag.toLowerCase()));
    return av.length ? av : false;
  };
  const save = () => {
    if (post.title && post.text) {
      let payload = {
        ...post,
        ["slug"]: post.title.replace(/\s+/g, "-")
      };
      payload["tags"] = "";
      (post.tags || []).map(i => {
        payload["tags"] += ` . ${i.id}`;
      });
      $.ajax({
        method: "POST",
        url: apiPath,
        data: payload,
        success: r => {
          setMessages(r);
          if (r.result) {
            if (r.tags) {
              showMsg(r.tags);
            }
            setSaved(true);
            setApiPath(`/api/write/${r.id || post.id}`);
            setPost({
              ...post,
              ["id"]: r.id
            });
            window.history.pushState(null, null, "/write/" + (r.id || post.id));
            showMsg("Successfully saved");
          } else {
            setMessages(r);
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Fill all fields");
    }
  };
  const searchTag = (e = {
    target: {}
  }, append = false) => {
    const text = e.target.value || srchTag;
    $.ajax({
      method: "POST",
      url: "/api/search-tags",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        text: text,
        page: crntTags.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          if (append) {
            r["items"] = crntTags.items.concat(r.items);
          }
          setCrntTags({
            ...r,
            ["isReady"]: true
          });
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
      }
    });
  };
  useEffect(() => {
    const load = document.querySelector("#tagsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (srchTag.replace(/\W+/g, "").length) {
            searchTag({
              target: {
                value: srchTag
              }
            }, true);
          } else {
            getTopTags();
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [srchTag, topTags, crntTags]);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, is404 ? /*#__PURE__*/React.createElement(Page404, null) : /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "relative px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 focus-visible:border-gray-700"
  }, "Upload", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: handleUpload,
    className: "cursor-pointer w-full h-full opacity-0 absolute right-0 bottom-0"
  })), saved ? /*#__PURE__*/React.createElement("button", {
    onClick: deletePost,
    className: "ml-2 text-red-500 relative px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 focus-visible:border-gray-700"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "Delete"), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-trash sm:hidden"
  })) : ""), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saved ? status : save,
    className: "z-10 top-3 right-3 fixed sm:relative sm:top-0 sm:right-0 px-8 py-2 sm:translate-x-0 sm:translate-y-0 sm:px-4 sm:py-1 bg-gray-900 text-white rounded-full mr-2 cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 "
  }, saved ? post.isPub ? "Draft" : "Publish" : "Save"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsPreview(!isPreview),
    className: "px-4 py-1 border-2 border-gray-300 rounded-full cursor-pointer active:scale-[0.98] active:opacity-90 transition-all focus-visible:scale-110 focus-visible:border-gray-700"
  }, isPreview ? "Edit" : "Preview"))), isPreview ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "head flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center "
  }, /*#__PURE__*/React.createElement("img", {
    src: data.me.profile,
    alt: `${data.me.name}'s image`,
    className: "w-12 h-12 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col ml-3"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-md sm:text-xl font-semibold max-w-[19ch] sm:max-w-[25ch] lg:max-w-[50ch] truncate"
  }, data.me.name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, timeSince(post.date)), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 mx-1"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, Math.ceil((cleanMd(post.text || "") || "").split(" ").length / 200), " ", "min ", /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, "read")))))), /*#__PURE__*/React.createElement("div", {
    className: "tags flex mt-3 items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6"
  }, post.tags && post.tags.map(i => /*#__PURE__*/React.createElement(Tag, {
    tag: i,
    key: i.id
  })))), /*#__PURE__*/React.createElement("article", {
    dir: "auto",
    className: "post-body mt-2",
    dangerouslySetInnerHTML: {
      __html: DOMPurify.sanitize(marked.parse(`# ` + (post.title || "Title") + `\n` + (post.text || "Post body")))
    }
  })) : /*#__PURE__*/React.createElement("div", {
    className: "write"
  }, /*#__PURE__*/React.createElement("input", {
    defaultValue: post.title,
    className: "text-2xl w-full",
    type: "text",
    name: "title",
    onChange: handleChange,
    placeholder: "Title of the post"
  }), /*#__PURE__*/React.createElement("span", {
    className: `${messages.title || messages.slug ? "text-red-500" : "text-gray-700"} text-sm`
  }, messages.title || messages.slug || "Show on top of post and other people can find your post with it."), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: ""
  }, post.tags && post.tags.map(i => /*#__PURE__*/React.createElement("span", {
    key: i.id,
    className: "p-1 border-b-[1px] border-gray-300 mr-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-${genColor(i.id)}`
  }, "#", /*#__PURE__*/React.createElement("span", {
    className: "ml-1 text-gray-700"
  }, i.name)), /*#__PURE__*/React.createElement("i", {
    className: "bi bi-x p-1 cursor-pointer",
    onClick: () => {
      setPost({
        ...post,
        ["tags"]: (post.tags || []).filter(pt => pt.id != i.id)
      });
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "relative group mt-2 sm:mt-0"
  }, !post.tags || post.tags.length < 3 ? /*#__PURE__*/React.createElement("input", {
    autoComplete: "none",
    type: "text",
    id: "tagInput",
    className: "w-full",
    placeholder: "Add tags",
    onChange: e => {
      searchTag(e);
      setSrchTag(e.target.value);
    },
    defaultValue: srchTag
  }) : "", /*#__PURE__*/React.createElement("ul", {
    id: "tagsContainer",
    className: " rounded-xl absolute top-[2rem] left-0 bg-gray-100 shadow-xl h-64 overflow-auto opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto w-64"
  }, (avTags() || (!srchTag.includes(" ") ? [{
    id: srchTag,
    name: srchTag
  }] : [])).map(i => /*#__PURE__*/React.createElement("li", {
    key: i.id
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setPost({
        ...post,
        ["tags"]: (post.tags || []).concat(i)
      });
      $("#tagInput").val("");
      setSaved(false);
    },
    className: "w-full flex  hover:bg-gray-200 px-3 focus-visible:bg-gray-200  py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center w-full"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-${genColor(i.id)} text-5xl mr-2 `
  }, "#"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-start"
  }, /*#__PURE__*/React.createElement("h1", {
    name: `# ${i.name}`,
    className: "text-md truncate contents"
  }, i.name), /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-gray-500 "
  }, nFormatter(i.followers || 0), " Followers")))))), topTags.hasNext && topTags.isReady || crntTags.hasNext && crntTags.isReady ? /*#__PURE__*/React.createElement("div", {
    className: "w-full py-3 loading text-xl text-center"
  }, "...") : ""))), /*#__PURE__*/React.createElement("textarea", {
    dir: "auto",
    defaultValue: post.text,
    onChange: handleChange,
    name: "text",
    placeholder: "Body of the post",
    className: "mt-3 text-xl w-full h-[70vh] resize-none"
  }), /*#__PURE__*/React.createElement("span", {
    className: `${messages.text ? "text-red-500" : "text-gray-700"} text-sm`
  }, messages.text || /*#__PURE__*/React.createElement("span", null, "We use", /*#__PURE__*/React.createElement("a", {
    href: "#markdown",
    target: "_blank",
    className: "text-indigo-500 mx-1 contents"
  }, "markdown"), "to render your post body."))))));
};
const MeView = ({}) => {
  const [data, setData] = useContext(Context);
  const [state, setState] = useState("drafts");
  const [showSide, setShowSide] = useState(null);
  const [posts, setPosts] = useState({
    items: [],
    hasNext: true
  });
  const [dposts, setDposts] = useState({
    items: [],
    hasNext: true
  });
  const [followers, setFollowers] = useState({
    items: [],
    hasNext: true
  });
  const [followings, setFollowings] = useState({
    items: [],
    hasNext: true
  });
  const [tags, setTags] = useState({
    items: [],
    hasNext: true
  });
  const getPosts = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/posts",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      }
    });
  };
  const getDposts = () => {
    $.ajax({
      method: "POST",
      url: "/api/me/dposts",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: dposts.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = dposts.items.concat(r.items);
          r["isReady"] = true;
          setDposts(r);
        } else {
          showMsg("An unexpected error occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getDposts, 10000);
      }
    });
  };
  const getFollowers = () => {
    if (followers.hasNext) {
      $.ajax({
        method: "POST",
        url: "/api/me/followers",
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          page: followers.items.length / 15
        },
        success: r => {
          if (r.result) {
            r["items"] = followers.items.concat(r.items);
            r["isReady"] = true;
            setFollowers(r);
          } else {
            showMsg("An unexpected error occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(getFollowers, 10000);
        }
      });
    }
  };
  const getFollowings = () => {
    if (followings.hasNext) {
      $.ajax({
        method: "POST",
        url: "/api/me/followings",
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          page: followings.items.length / 15 + 1
        },
        success: r => {
          if (r.result) {
            r["items"] = followings.items.concat(r.items);
            r["isReady"] = true;
            setFollowings(r);
          } else {
            showMsg("An unexpected error occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(getFollowings, 10000);
        }
      });
    }
  };
  const getTags = () => {
    if (tags.hasNext) {
      $.ajax({
        method: "POST",
        url: "/api/me/tags",
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          page: tags.items.length / 15 + 1
        },
        success: r => {
          if (r.result) {
            r["items"] = tags.items.concat(r.items);
            r["isReady"] = true;
            setTags(r);
          } else {
            showMsg("An unexpected error occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(getTags, 10000);
        }
      });
    }
  };
  const getBase = () => {
    $.ajax({
      method: "GET",
      url: "/api/base/me",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        if (r.result) {
          setPosts({
            ...r.posts,
            ["isReady"]: true
          });
          setDposts({
            ...r.dposts,
            ["isReady"]: true
          });
          setData({
            ...data,
            ["me"]: r.me || {}
          });
          data.setIsReady(true);
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getBase, 10000);
      }
    });
  };
  useEffect(() => {
    getBase();
  }, [1]);
  const closeSide = e => {
    if (e.target.id == "close") {
      setShowSide(null);
      setFollowings({
        items: [],
        hasNext: true
      });
      setFollowers({
        items: [],
        hasNext: true
      });
      setTags({
        items: [],
        hasNext: true
      });
    }
  };
  const Container = ({
    sideName
  }) => {
    useEffect(() => {
      if (sideName == "tags") {
        getTags();
      } else if (sideName == "followings") {
        getFollowings();
      } else if (sideName == "followers") {
        getFollowers();
      }
    }, [1]);
    useEffect(() => {
      const load = document.querySelector("#itemsContainer .loading");
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (sideName == "followings") {
              getFollowings();
            } else if (sideName == "followers") {
              getFollowers();
            } else if (sideName == "tags") {
              getTags();
            }
          }
        });
      });
      if (load) {
        observer.observe(load);
      }
    }, [followers, followings, tags]);
    return /*#__PURE__*/React.createElement("div", {
      id: "close",
      onClick: closeSide,
      className: `bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-20 `
    }, /*#__PURE__*/React.createElement("div", {
      className: "transition-all border-2 border-gray-100 flex flex-col z-20 bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]"
    }, /*#__PURE__*/React.createElement("button", {
      id: "close",
      className: "p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"
    })), /*#__PURE__*/React.createElement("div", {
      id: "itemsContainer",
      className: "overflow-auto h-full sm:ml-4 px-2 pb-2"
    }, sideName == "tags" && tags.isReady ? tags.items.map(item => /*#__PURE__*/React.createElement(TagItem, {
      tag: item,
      key: item.id
    })) : sideName == "tags" ? [1, 2, 3, 4, 5,, 6, 7, 8, 9].map(item => /*#__PURE__*/React.createElement(TagItem, {
      loading: true,
      key: item.id
    })) : "", sideName == "followers" && followers.isReady ? followers.items.map(item => /*#__PURE__*/React.createElement(PeopleItem, {
      user: item,
      key: item.id
    })) : sideName == "followers" ? [1, 2, 3, 4, 5,, 6, 7, 8, 9].map(item => /*#__PURE__*/React.createElement(PeopleItem, {
      loading: true,
      key: item.id
    })) : "", sideName == "followings" && followings.isReady ? followings.items.map(item => /*#__PURE__*/React.createElement(PeopleItem, {
      user: item,
      key: item.id
    })) : sideName == "followings" ? [1, 2, 3, 4, 5,, 6, 7, 8, 9].map(item => /*#__PURE__*/React.createElement(PeopleItem, {
      loading: true,
      key: item
    })) : "", sideName == "followings" && followings.isReady && followings.hasNext || sideName == "followers" && followers.isReady && followers.hasNext || sideName == "tags" && tags.isReady && tags.hasNext ? /*#__PURE__*/React.createElement(Loading, null) : "")));
  };
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (state == "pubs") {
            getPosts();
          } else {
            getDposts();
          }
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts, dposts]);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 sm:flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, data.me.id ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: data.me.profile,
    alt: `${data.me.name}'s image`,
    className: "w-24 h-24 sm:h-36 sm:w-36 lg:h-46 lg:w-46 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex w-full justify-around"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowSide("followers");
    },
    className: "flex flex-col sm:flex-row items-center focus-visible:scale-110  "
  }, nFormatter(data.me.followers), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 sm:ml-2"
  }, "Followers")), showSide == "followers" ? /*#__PURE__*/React.createElement(Container, {
    sideName: "followers"
  }) : "", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowSide("followings");
    },
    className: "flex flex-col sm:flex-row items-center focus-visible:scale-110  "
  }, nFormatter(data.me.followings), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 sm:ml-2"
  }, "Followings")), showSide == "followings" ? /*#__PURE__*/React.createElement(Container, {
    sideName: "followings"
  }) : "", /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowSide("tags");
    },
    className: "flex flex-col sm:flex-row items-center focus-visible:scale-110  "
  }, nFormatter(data.me.tags), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 sm:ml-2"
  }, "Tags")), showSide == "tags" ? /*#__PURE__*/React.createElement(Container, {
    sideName: "tags"
  }) : "")), /*#__PURE__*/React.createElement("h1", {
    className: "py-1 text-2xl"
  }, data.me.name), /*#__PURE__*/React.createElement("p", {
    className: " text-gray-700"
  }, data.me.bio)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-28 h-28 sm:h-36 sm:w-36 lg:h-46 lg:w-46  rounded-full bg-gray-200 fadeInLoad overflow-hidden relative"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex w-[60%] justify-around"
  }, /*#__PURE__*/React.createElement("button", {
    className: "flex flex-col sm:flex-row items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 sm:ml-2"
  }, "Followers")), /*#__PURE__*/React.createElement("button", {
    className: "flex flex-col sm:flex-row items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 sm:ml-2"
  }, "Followings")), /*#__PURE__*/React.createElement("button", {
    className: "flex flex-col sm:flex-row items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 sm:ml-2"
  }, "Tags")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 my-1 h-5 w-1/4 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 my-1 h-3 w-9/12 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-1 h-3 w-1/2 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 border-b-2 text-sm sm:text-base flex justify-between sm:block"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (dposts.items.length == 0) {
        getDposts();
      }
      setState("drafts");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "drafts" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "Drafts"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (posts.items.length == 0) {
        getPosts();
      }
      setState("pubs");
    },
    className: `transition-all py-2 px-3 translate-y-[2px] border-b-2 w-full sm:w-auto focus-visible:scale-110  focus-visible:opacity-100 ${state == "pubs" ? "border-gray-900" : "opacity-[0.75]"}`
  }, "Publications")), /*#__PURE__*/React.createElement("div", {
    id: "postsContainer"
  }, state == "pubs" && posts.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })), state == "drafts" && dposts.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })), state == "drafts" && !dposts.isReady || state == "pubs" && !posts.isReady ? [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  })) : "", state == "drafts" && dposts.isReady && dposts.hasNext || state == "pubs" && posts.isReady && posts.hasNext ? /*#__PURE__*/React.createElement(Loading, null) : ""))));
};
const PeopleView = ({}) => {
  const [data, setData] = useContext(Context);
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({
    items: [],
    hasNext: true
  });
  const url = useParams();
  const getBase = () => {
    $.ajax({
      method: "GET",
      url: `/api/base/@${url.username}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setUser(r.user);
        setPosts({
          ...r.posts,
          ["isReady"]: true
        });
        setData({
          ...data,
          ["me"]: r.me
        });
        data.setIsReady(true);
      },
      error: () => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
          setTimeout(getUser, 10000);
        }
      }
    });
  };
  const getPosts = () => {
    $.ajax({
      method: "POST",
      url: `/api/posts/@${url.username}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      }
    });
  };
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getPosts();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts]);
  useEffect(() => {
    getBase();
  }, [1]);
  const follow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/follow/@${user.username}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: user.id
        },
        success: r => {
          if (r.result) {
            setUser({
              ...user,
              ["followed"]: !user.followed
            });
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, user.id ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: user.profile,
    alt: `${user.name}'s image`,
    className: "h-14 w-14 sm:h-16 sm:w-16 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: " ml-2 overflow-hidden"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl sm:text-2xl truncate"
  }, user.name, /*#__PURE__*/React.createElement("small", {
    className: "text-gray-500 hidden sm:inline mx-1"
  }, "@", user.username)), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, nFormatter(user.followers), " Followers"))), /*#__PURE__*/React.createElement("button", {
    onClick: follow,
    className: `py-1 px-3 mx-2 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${user.followed ? "text-indigo-500  bg-white" : "text-white bg-indigo-500"} `
  }, user.followed ? "Unfollow" : "Follow")), /*#__PURE__*/React.createElement("p", {
    dir: "auto",
    className: "my-4 text-gray-700"
  }, user.bio)) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center fadeInLoad overflow-hidden relative "
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: " ml-2 w-4/5 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 bg-gray-200 rounded-full w-32"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ml-1 h-4 bg-gray-200 rounded-full w-16"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 h-4 bg-gray-200 rounded-full w-16"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 my-1 h-3 w-9/12 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-1 h-3 w-1/2 rounded-full bg-gray-200 fadeInLoad overflow-hidden relative"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-8 border-b-2 border-gray-400 flex "
  }, /*#__PURE__*/React.createElement("button", {
    className: "py-2 px-3 border-b-2 border-gray-900 translate-y-[2px] opacity-90 "
  }, "Home")), /*#__PURE__*/React.createElement("div", {
    id: "postsContainer"
  }, posts.isReady ? posts.items.map(i => /*#__PURE__*/React.createElement(Post, {
    post: i,
    key: i.id
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  })), posts.hasNext && posts.isReady ? /*#__PURE__*/React.createElement(Loading, null) : ""))));
};
const SettingsView = ({}) => {
  const [data, setData] = useContext(Context);
  const [editField, setEditField] = useState(null);
  const [messages, setMessages] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSide, setShowSide] = useState(null);
  useEffect(() => {
    getMyInfo([data, setData]);
  }, [1]);
  const Container = ({
    sideName,
    title,
    about,
    btn,
    func
  }) => {
    const [pass, setPass] = useState("");
    const deleteAccount = () => {
      $.ajax({
        method: "POST",
        url: "/api/accounts/delete",
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          password: pass
        },
        success: r => {
          if (r.result) {
            document.location = "/";
          } else {
            setMessages(r);
          }
        },
        error: () => {
          setShowSide(null);
          showMsg("An unknown network error has occurred");
        }
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      id: "close",
      onClick: closeSide,
      className: `${showSide == sideName ? "bg-[#00000078]" : "pointer-events-none opacity-0"} fixed flex h-screen items-center justify-center right-0 top-0 w-screen z-20 transition-all backdrop-blur-sm`
    }, /*#__PURE__*/React.createElement("div", {
      className: `bg-white rounded-xl w-2/3 max-w-lg transition-all ${!showSide == sideName ? "scale-75 opacity-0" : ""}`
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-xl px-6 pt-4"
    }, title), /*#__PURE__*/React.createElement("p", {
      className: "px-6 py-4 text-gray-700"
    }, about), showSide == "delete" ? /*#__PURE__*/React.createElement("div", {
      className: "w-full my-1 text-lg flex flex-col px-6 py-2"
    }, /*#__PURE__*/React.createElement("input", {
      className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
      type: "password",
      name: "password",
      placeholder: "Current password",
      onChange: e => setPass(e.target.value),
      required: true
    }), /*#__PURE__*/React.createElement("span", {
      className: `text-sm text-red-500 pt-1 ${messages.password ? "opacity-100" : "opacity-0"}`
    }, messages.password)) : "", /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: showSide == "delete" ? deleteAccount : func,
      className: "border-t-2 border-t-gray-100 p-3 text-red-500"
    }, btn), /*#__PURE__*/React.createElement("button", {
      id: "close",
      onClick: closeSide,
      className: "border-t-2 border-t-gray-100 p-3"
    }, "Cancel"))));
  };
  const manageForm = e => {
    if (e.target.name == "profile") {
      showMsg("Processing...");
      const [file] = e.target.files;
      setIsLoading(true);
      const pyload = new FormData();
      pyload.append("profile", file);
      pyload.append("csrfmiddlewaretoken", data.csrfmiddlewaretoken);
      $.ajax({
        method: "POST",
        url: "/api/me/edit",
        data: pyload,
        contentType: false,
        processData: false,
        success: r => {
          if (r.result) {
            setData({
              ...data,
              ["me"]: r.me
            });
            setIsLoading(false);
            setEditField(null);
            setFormData({});
          } else {
            showMsg(r.profile || "An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    if (e.target.name == "password2" && formData.password1 != e.target.value) {
      setMessages({
        ...messages,
        ["password"]: "passwords don't match."
      });
    } else {
      setMessages({
        ...messages,
        ["password"]: null
      });
    }
  };
  const killAll = () => {
    $.ajax({
      method: "POST",
      url: "/api/accounts/kill-other",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setShowSide(null);
        if (r.result) {
          showMsg("Successfully killed");
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        setShowSide(null);
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const signOut = () => {
    $.ajax({
      method: "POST",
      url: "/api/accounts/log-out",
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setIsLoading(false);
        if (r.result) {
          document.location = "/";
        } else {
          setMessages(r);
        }
      },
      error: () => {
        setShowSide(null);
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const closeSide = e => {
    if (e.target.id == "close") {
      setShowSide(null);
      setMessages({});
      setIsLoading(false);
      setEditField(null);
    }
  };
  const changePassword = e => {
    e.preventDefault();
    setIsLoading(true);
    const pyload = formData;
    pyload["csrfmiddlewaretoken"] = data.csrfmiddlewaretoken;
    $.ajax({
      method: "POST",
      url: "/api/accounts/change-password",
      data: pyload,
      success: r => {
        setIsLoading(false);
        if (r.result) {
          setData({
            ...data,
            ["csrfmiddlewaretoken"]: r.csrfmiddlewaretoken
          });
          setShowSide(null);
          setFormData({});
          showMsg("Password successfully changed.");
        } else {
          setMessages(r);
        }
      },
      error: () => {
        setShowSide(null);
        setFormData({});
        showMsg("An unknown network error has occurred");
      }
    });
  };
  const save = e => {
    e.preventDefault();
    setIsLoading(true);
    const pyload = formData;
    pyload["csrfmiddlewaretoken"] = data.csrfmiddlewaretoken;
    $.ajax({
      method: "POST",
      url: "/api/me/edit",
      data: pyload,
      success: r => {
        setIsLoading(false);
        if (r.result) {
          setData({
            ...data,
            ["me"]: r.me
          });
          setEditField(null);
          setFormData({});
          showMsg("Successfully changed");
        }
        setMessages(r);
      },
      error: () => {
        setIsLoading(false);
        setEditField(null);
        setFormData({});
        showMsg("An unknown network error has occurred");
      }
    });
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, data.me.id ? /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl border-b-2 border-gray-300 mb-4 py-2"
  }, "About you"), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Photo"), /*#__PURE__*/React.createElement("p", {
    className: "py-1 text-gray-700"
  }, "Your photo apears on your Profile page and with your posts across blog."), /*#__PURE__*/React.createElement("p", {
    className: "py-1 text-gray-700"
  }, "Reccomened size: Square, at least 1000 pixels per side. File type: JPG, PNG or GIF")), /*#__PURE__*/React.createElement("div", {
    className: "relative group flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("input", {
    name: "profile",
    type: "file",
    onChange: manageForm,
    className: "w-full h-full absolute cursor-pointer opacity-0 z-[2]",
    title: "Click to change profile image"
  }), /*#__PURE__*/React.createElement("img", {
    src: data.me.profile,
    alt: `${data.me.name}'s image`,
    className: "w-[6rem] sm:w-[7rem] aspect-square rounded-full group-hover:brightness-75"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-5 h-5 rounded-full flex items-center justify-center bg-[#0000001a] opacity-75 group-hover:opacity-100 group-hover:scale-105"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-pencil absolute text-white"
  })))), /*#__PURE__*/React.createElement("form", {
    onSubmit: save,
    className: "flex justify-between mb-6 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Username"), editField == "username" ? /*#__PURE__*/React.createElement("input", {
    defaultValue: data.me.username,
    type: "text",
    name: "username",
    maxLength: 30,
    pattern: "^(?!.*\\.\\.)(?!.*\\.$)[^\\W][a-z0-9_.]{2,29}$",
    placeholder: "Username",
    onChange: manageForm,
    className: "py-1 border-b-2 border-gray-300 w-full focus:border-gray-500",
    disabled: !(editField == "username")
  }) : /*#__PURE__*/React.createElement("span", {
    className: "py-1 border-b-2 border-gray-300 w-full block"
  }, data.me.username), /*#__PURE__*/React.createElement("span", {
    className: `text-red-500 text-sm ${messages.username ? "opacity-100" : "opacity-0"}`
  }, messages.username || "Invalid usernadata.me."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700"
  }, "other people can find you with this username.")), /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0"
  }, editField == "username" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    onClick: save,
    className: `text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all  ${isLoading && !showSide ? "opacity-75 cursor-wait" : ""}`
  }, isLoading && !showSide ? "Saving..." : "Save"), /*#__PURE__*/React.createElement("button", {
    id: "close",
    type: "reset",
    onClick: closeSide,
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditField("username"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Edit"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: save,
    className: "flex justify-between mb-6 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Name"), editField == "name" ? /*#__PURE__*/React.createElement("input", {
    onChange: manageForm,
    defaultValue: data.me.name,
    type: "text",
    maxLength: 50,
    placeholder: "Your name",
    dir: "auto",
    name: "name",
    className: "py-1 border-b-2 border-gray-300 w-full focus:border-gray-500",
    disabled: !(editField == "name")
  }) : /*#__PURE__*/React.createElement("span", {
    className: "py-1 border-b-2 border-gray-300 w-full block"
  }, data.me.name), /*#__PURE__*/React.createElement("span", {
    className: `text-red-500 text-sm ${messages.name ? "opacity-100" : "opacity-0"}`
  }, messages.name || "Invalid nadata.me."), /*#__PURE__*/React.createElement("p", {
    className: " text-gray-700"
  }, "Your name appeare on your Profile page, as your byline, and in your responses.")), /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0"
  }, editField == "name" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: `text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${isLoading && !showSide ? "opacity-75 cursor-wait" : ""}`
  }, isLoading && !showSide ? "Saving..." : "Save"), /*#__PURE__*/React.createElement("button", {
    id: "close",
    onClick: closeSide,
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditField("name"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Edit"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: save,
    className: "flex justify-between mb-6 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Bio"), editField == "bio" ? /*#__PURE__*/React.createElement("input", {
    onChange: manageForm,
    dir: "auto",
    defaultValue: data.me.bio,
    type: "text",
    name: "bio",
    maxLength: 150,
    placeholder: "Add your bio",
    className: "py-1 border-b-2 border-gray-300 w-full focus:border-gray-500",
    disabled: !(editField == "bio")
  }) : /*#__PURE__*/React.createElement("span", {
    className: "py-1 border-b-2 border-gray-300 w-full block"
  }, data.me.bio), /*#__PURE__*/React.createElement("span", {
    className: `text-red-500 text-sm ${messages.bio ? "opacity-100" : "opacity-0"}`
  }, messages.bio || "Invalid bio."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700"
  }, "Your bio appears on your Profile and next to your posts.")), /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0"
  }, editField == "bio" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: `text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${isLoading && !showSide ? "opacity-75 cursor-wait" : ""}`
  }, isLoading && !showSide ? "Saving..." : "Save"), /*#__PURE__*/React.createElement("button", {
    id: "close",
    onClick: closeSide,
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditField("bio"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Edit"))), /*#__PURE__*/React.createElement("form", {
    onSubmit: save,
    className: "flex justify-between mb-6 relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Email"), editField == "email" ? /*#__PURE__*/React.createElement("input", {
    onChange: manageForm,
    defaultValue: data.me.email,
    type: "email",
    placeholder: "email address",
    name: "email",
    className: "py-1 border-b-2 border-gray-300 w-full focus:border-gray-500",
    disabled: !(editField == "email")
  }) : /*#__PURE__*/React.createElement("span", {
    className: "py-1 border-b-2 border-gray-300 w-full block"
  }, data.me.email), /*#__PURE__*/React.createElement("span", {
    className: `text-red-500 text-sm ${messages.email ? "opacity-100" : "opacity-0"}`
  }, messages.email || "Invalid email."), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-700"
  }, "Your email address. this is your account identifire.")), /*#__PURE__*/React.createElement("div", {
    className: "absolute right-0"
  }, editField == "email" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: save,
    className: `text-white bg-indigo-500 whitespace-pre py-1 px-5  border-r-0 border-2 border-indigo-500 rounded-br-none rounded-tr-none rounded-full active:scale-[0.98] active:opacity-90 transition-all ${isLoading && !showSide ? "opacity-75 cursor-wait" : ""}`
  }, isLoading && !showSide ? "Saving..." : "Save"), /*#__PURE__*/React.createElement("button", {
    id: "close",
    onClick: closeSide,
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-bl-none rounded-tl-none rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Cancel")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => setEditField("email"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Edit"))), /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl border-b-2 border-gray-300 mb-4 mt-6 py-2"
  }, "Account"), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Change password"), /*#__PURE__*/React.createElement("p", {
    className: "py-1 text-gray-700"
  }, "change your accounts password with given the old password")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShowSide("changePassword");
      setIsLoading(false);
    },
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Change")), showSide == "changePassword" ? /*#__PURE__*/React.createElement("div", {
    id: "close",
    onClick: closeSide,
    className: `bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-20 ${showSide == "changePassword" ? "" : "opacity-0 pointer-events-none"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: `${showSide == "changePassword" ? "translate-0" : "translate-y-[100%] sm:translate-x-[100%] sm:translate-y-0"} overflow-auto transition-all border-2 border-gray-100 flex flex-col bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]`
  }, /*#__PURE__*/React.createElement("button", {
    id: "close",
    className: "p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: changePassword,
    method: "POST",
    className: "flex flex-col items-center justify-center p-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-2xl w-full mb-2"
  }, "Change Your Password"), /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "password",
    name: "old_password",
    placeholder: "Current password",
    autoComplete: "current-password",
    onChange: manageForm,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.old_password ? "opacity-100" : "opacity-0"}`
  }, messages.old_password || ".")), /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "password",
    name: "new_password1",
    placeholder: "New password",
    autoComplete: "new-password",
    onChange: manageForm,
    pattern: ".{8,}",
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.new_password1 ? "opacity-100" : "opacity-0"}`
  }, messages.new_password1 || "Password is too short.")), /*#__PURE__*/React.createElement("div", {
    className: "w-full my-1 text-lg flex flex-col"
  }, /*#__PURE__*/React.createElement("input", {
    className: "border-gray-300 border-b-2 py-1 placeholder:text-gray-600 w-full focus:border-gray-500 focus:placeholder:text-gray-700",
    type: "password",
    name: "new_password2",
    placeholder: "Retype new password",
    autoComplete: "new-password",
    onChange: manageForm,
    required: true
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-sm text-red-500 pt-1 ${messages.new_password2 ? "opacity-100" : "opacity-0"}`
  }, messages.new_password2 || ".")), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: !(formData.old_password && formData.new_password1 == formData.new_password2 && formData.new_password1),
    className: `px-4 py-3 w-full mt-1 rounded-full active:scale-[0.98] transition-all flex items-center justify-center bg-gray-900 text-white font-semibold text-lg disabled:opacity-50 disabled:pointer-events-none ${isLoading ? "opacity-50 cursor-wait" : ""}`
  }, isLoading ? "Changing..." : "Change"), /*#__PURE__*/React.createElement(Link, {
    name: "Reset Password",
    onClick: setTitle,
    to: "/accounts/reset",
    className: "text-indigo-500 mt-3"
  }, "Reset password")))) : ""), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Sign out of all other sessions"), /*#__PURE__*/React.createElement("p", {
    className: "py-1 text-gray-700"
  }, "This will sign you out of sessions on other browsers or on other computers")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSide("killother"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Kill other")), showSide == "killother" ? /*#__PURE__*/React.createElement(Container, {
    sideName: "killother",
    title: "Kill all another sessions?",
    about: "if you press kill, all another sessions in another computers and browsers will be sign out.",
    btn: "Kill",
    func: killAll
  }) : ""), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Sign out "), /*#__PURE__*/React.createElement("p", {
    className: "py-1 text-gray-700"
  }, "This will sign you out of session on this browser.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSide("signout"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Sign out")), showSide == "signout" ? /*#__PURE__*/React.createElement(Container, {
    sideName: "signout",
    title: "Sing out from this account?",
    about: "This will sign you out of session on this browser.",
    btn: "Sign out",
    func: signOut
  }) : ""), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "py-1 text-xl"
  }, "Delete account"), /*#__PURE__*/React.createElement("p", {
    className: "py-1 text-gray-700"
  }, "Permanently delete your account and all of your content")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowSide("delete"),
    className: "whitespace-pre py-1 px-3  border-2 border-gray-300 rounded-full active:scale-[0.98] active:opacity-90 transition-all hover:border-gray-700 focus-visible:border-gray-700"
  }, "Delete")), showSide == "delete" ? /*#__PURE__*/React.createElement(Container, {
    sideName: "delete",
    title: "Delete your account?",
    about: "Permanently delete your account and all of your contents",
    btn: "Delete",
    func: null
  }) : "")) : /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b-2 border-gray-300 mb-4 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-1/2 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-3/4 fadeInLoad overflow-hidden relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 my-1 w-full bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 my-1 w-3/4 bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-3 my-1 w-full bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 my-1 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", {
    className: "  flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-[6rem] sm:w-[7rem] aspect-square rounded-full relative fadeInLoad overflow-hidden bg-gray-200"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-3 w-1/2 bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-3 w-1/2 bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-3 w-1/2 bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-3 w-1/2 bg-gray-200 rounded-full"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-12 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "border-b-2 border-gray-300 mb-4 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-1/2 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 rounded-full bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 rounded-full bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 rounded-full bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 overflow-hidden relative fadeInLoad"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-5 my-1 w-1/4 rounded-full bg-gray-200"
  }), /*#__PURE__*/React.createElement("div", {
    className: "h-3 mt-2 w-3/4 bg-gray-200 rounded-full "
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-16 h-8"
  }))))));
};
const PostDetail = ({}) => {
  const [data, setData] = useContext(Context);
  const [post, setPost] = useState({});
  const [is404, setIs404] = useState(false);
  const [posts, setPosts] = useState({
    items: [],
    hasNext: true
  });
  const [showComments, setShowComments] = useState(false);
  const url = useParams();
  const getPost = (username = url.username, slug = url.postSlug) => {
    $.ajax({
      method: "POST",
      url: `/api/@${username}/${slug}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken
      },
      success: r => {
        setPost({
          ...r.post,
          ["isReady"]: true
        });
        setPosts({
          ...r.posts,
          ["isReady"]: true
        });
        setData({
          ...data,
          ["me"]: r.me || {}
        });
        data.setIsReady(true);
      },
      error: xhr => {
        if (xhr.status == 404) {
          setIs404(true);
        } else {
          showMsg("An unknown network error has occurred");
          setTimeout(getPost, 10000);
        }
      }
    });
  };
  const getPosts = (username = url.username) => {
    $.ajax({
      method: "POST",
      url: `/api/posts/@${username}`,
      data: {
        csrfmiddlewaretoken: data.csrfmiddlewaretoken,
        page: posts.items.length / 15 + 1
      },
      success: r => {
        if (r.result) {
          r["items"] = posts.items.concat(r.items);
          r["isReady"] = true;
          setPosts(r);
        } else {
          showMsg("An unknown error has occurred");
        }
      },
      error: () => {
        showMsg("An unknown network error has occurred");
        setTimeout(getPosts, 10000);
      }
    });
  };
  useEffect(() => {
    getPost();
  }, [1]);
  useEffect(() => {
    const load = document.querySelector("#postsContainer .loading");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getPosts();
        }
      });
    });
    if (load) {
      observer.observe(load);
    }
  }, [posts]);
  const follow = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/follow/@${post.user.username}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: post.user.id
        },
        success: r => {
          if (r.result) {
            setPost({
              ...post,
              ["user"]: {
                ...post.user,
                ["followed"]: !post.user.followed
              }
            });
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  const bookmark = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/@${post.user.username}/${post.slug}/bookmark`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: post.id
        },
        success: r => {
          if (r.result) {
            setPost({
              ...post,
              ["bookmark"]: !post.bookmark
            });
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  const like = () => {
    if (data.me.id) {
      $.ajax({
        method: "POST",
        url: `/api/@${post.user.username}/${post.slug}/like`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          id: post.id
        },
        success: r => {
          if (r.result) {
            setPost({
              ...post,
              ["likes"]: post.liked ? post.likes - 1 : post.likes + 1
            });
            setPost({
              ...post,
              ["liked"]: !post.liked
            });
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
        }
      });
    } else {
      showMsg("Please login");
    }
  };
  const closeSide = e => {
    if (e.target.id == "close") {
      setShowComments(false);
    }
  };
  const Container = ({}) => {
    const [comments, setComments] = useState({
      items: [],
      hasNext: true
    });
    const [replayTo, setReplayTo] = useState(null);
    const addComment = e => {
      const text = e.target.parentElement.children[1].value;
      $.ajax({
        method: "POST",
        url: "/api/add-comment",
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          text: text,
          post: post.id,
          replaied_to: replayTo ? replayTo.id : null
        },
        success: r => {
          if (r.result) {
            $("#commentInput").val("");
            if (replayTo) {
              setComments({
                ...comments,
                ["items"]: comments.items.map(i => i.id == r.comment.replaied_to ? {
                  ...i,
                  ["responses"]: (i.responses || []).concat(r.comment)
                } : i)
              });
            } else {
              const comms = comments.items.copyWithin();
              comms.unshift(r.comment);
              setComments({
                ...comments,
                ["items"]: comms
              });
            }
            setReplayTo(null);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(addComment, 10000);
        }
      });
    };
    const Comment = ({
      comment,
      loading
    }) => {
      if (loading) {
        return /*#__PURE__*/React.createElement("div", {
          className: "sm:first:mt-2 px-2 py-2 border-b-2 border-gray-100"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center w-full fadeInLoad relative overflow-hidden "
        }, /*#__PURE__*/React.createElement("div", {
          className: "h-12 w-12 rounded-full m-1 bg-gray-200 "
        }), /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col p-1 w-4/5 "
        }, /*#__PURE__*/React.createElement("div", {
          className: "h-4 w-4/5 bg-gray-200 rounded-full"
        }), /*#__PURE__*/React.createElement("div", {
          className: "h-3 w-1/5 bg-gray-200 rounded-full mt-1"
        })))), /*#__PURE__*/React.createElement("div", {
          className: "mt-3 my-1 h-3 w-full rounded-full bg-gray-200 overflow-hidden fadeInLoad relative"
        }), /*#__PURE__*/React.createElement("div", {
          className: "my-1 h-3 w-3/4 rounded-full bg-gray-200 overflow-hidden fadeInLoad relative"
        }));
      } else {
        return /*#__PURE__*/React.createElement("div", {
          className: "sm:first:mt-2 px-2 py-2"
        }, /*#__PURE__*/React.createElement("div", {
          className: "border-2 border-gray-100 rounded-lg  px-2 py-1 my-1"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center justify-between"
        }, /*#__PURE__*/React.createElement("div", {
          className: "flex items-center w-full overflow-hidden"
        }, /*#__PURE__*/React.createElement("img", {
          src: comment.user.profile,
          alt: `${comment.user.name}'s image`,
          className: "h-12 w-12 rounded-full p-1 overflow-hidden"
        }), /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col p-1 max-w-5/6"
        }, /*#__PURE__*/React.createElement(Link, {
          name: comment.user.name,
          onClick: setTitle,
          to: `/@${comment.user.username}`,
          className: "text-md w-[80%] truncate"
        }, comment.user.name), /*#__PURE__*/React.createElement("span", {
          className: "text-gray-500 text-sm"
        }, timeSince(comment.date), /*#__PURE__*/React.createElement("button", {
          onClick: () => setReplayTo(comment),
          className: "border-[1px] border-indigo-500 inline mx-1 px-2 rounded-full sm:border-2 text-indigo-500"
        }, "Replay"))))), /*#__PURE__*/React.createElement("p", {
          className: "text-sm mt-1  text-gray-800"
        }, comment.text)), /*#__PURE__*/React.createElement("div", {
          className: "ml-6 my-2"
        }, (comment.responses || []).map(i => /*#__PURE__*/React.createElement("div", {
          key: i.id,
          className: "flex items-center w-full justify-start relative"
        }, (comment.responses || []).at(-1).id != i.id ? /*#__PURE__*/React.createElement("div", {
          className: "absolute w-2 border-l-2 border-l-gray-300 h-full left-6 top-0 translate-y-1"
        }) : "", /*#__PURE__*/React.createElement("img", {
          src: i.user.profile,
          alt: `${i.user.name}'s image`,
          className: "h-12 w-12 rounded-full p-1 mb-auto mr-2 z-[2] overflow-hidden"
        }), /*#__PURE__*/React.createElement("div", {
          className: "flex flex-col w-[calc(100%-52px)] border-2 border-gray-100 rounded-lg  p-2 my-1"
        }, /*#__PURE__*/React.createElement(Link, {
          name: i.user.name,
          onClick: setTitle,
          to: `/@${i.user.username}`,
          className: "text-md w-[80%] truncate"
        }, i.user.name), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
          className: "text-gray-500 text-sm"
        }, timeSince(i.date)), /*#__PURE__*/React.createElement("span", {
          className: "text-gray-400 mx-1"
        }, "\u2022"), /*#__PURE__*/React.createElement("span", {
          className: "text-gray-500 text-sm"
        }, "Replaying to", /*#__PURE__*/React.createElement(Link, {
          name: comment.user.name,
          onClick: setTitle,
          to: `/@${comment.user.username}`,
          className: "truncate text-indigo-500 ml-1"
        }, "@", comment.user.name))), /*#__PURE__*/React.createElement("p", {
          className: "text-sm mt-1 text-gray-800"
        }, i.text))))));
      }
    };
    const getComments = () => {
      $.ajax({
        method: "POST",
        url: `/api/comments/${post.id}`,
        data: {
          csrfmiddlewaretoken: data.csrfmiddlewaretoken,
          page: comments.items.length / 15 + 1
        },
        success: r => {
          if (r.result) {
            const allId = comments.items.map(i => i.id);
            r["items"] = comments.items.concat(r.items.map(i => !allId.includes(i.id) ? i : ""));
            r["isReady"] = true;
            r["load"] = !comments.load;
            setComments(r);
          } else {
            showMsg("An unknown error has occurred");
          }
        },
        error: () => {
          showMsg("An unknown network error has occurred");
          setTimeout(getComments, 10000);
        }
      });
    };
    useEffect(() => {
      getComments();
    }, [1]);
    useEffect(() => {
      const load = document.querySelector("#tagsContainer .loading");
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            getComments();
          }
        });
      });
      if (load) {
        observer.observe(load);
      }
    }, [comments.load]);
    return /*#__PURE__*/React.createElement("div", {
      id: "close",
      onClick: closeSide,
      className: "bg-[#00000078] backdrop-blur-sm fixed w-screen h-screen right-0 top-0 flex flex-col-reverse sm:flex-row-reverse z-20 "
    }, /*#__PURE__*/React.createElement("div", {
      className: "transition-all border-2 border-gray-100 flex flex-col bg-white absolute rounded-tr-3xl rounded-tl-3xl w-full h-4/5 sm:rounded-tr-none sm:rounded-bl-3xl sm:h-full sm:w-[28rem]"
    }, /*#__PURE__*/React.createElement("button", {
      id: "close",
      className: "p-2 w-full flex items-center justify-center sm:w-auto sm:h-full sm:left-0 sm:absolute"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rounded-full bg-gray-200 w-20 h-1 sm:h-20 sm:w-1"
    })), /*#__PURE__*/React.createElement("div", {
      id: "tagsContainer",
      className: "overflow-auto h-full sm:ml-4 px-2 pb-2"
    }, comments.isReady ? comments.items.map(i => /*#__PURE__*/React.createElement(Comment, {
      comment: i,
      key: i.id
    })) : [1, 2, 3, 4, 5, 6].map(i => /*#__PURE__*/React.createElement(Comment, {
      loading: true,
      key: i
    })), comments.isReady && comments.hasNext ? /*#__PURE__*/React.createElement(Loading, null) : ""), data.me.id ? /*#__PURE__*/React.createElement("div", null, replayTo ? /*#__PURE__*/React.createElement("div", {
      className: "border-t-2 border-gray-100 w-full py-2 px-3 text-gray-500 text-sm flex justify-between"
    }, /*#__PURE__*/React.createElement("span", null, "Replaying to", /*#__PURE__*/React.createElement("span", {
      className: "text-indigo-500 ml-2"
    }, "@", replayTo.user.username)), /*#__PURE__*/React.createElement("button", {
      onClick: () => setReplayTo(null)
    }, /*#__PURE__*/React.createElement("i", {
      className: "bi bi-x-circle-fill text-gray-700"
    }))) : "", /*#__PURE__*/React.createElement("div", {
      className: "w-full p-2 flex border-t-2 border-gray-100"
    }, /*#__PURE__*/React.createElement("img", {
      src: data.me.profile,
      alt: `${data.me.name}'s image`,
      className: "rounded-full h-9 w-9 p-1"
    }), /*#__PURE__*/React.createElement("input", {
      dir: "auto",
      maxLength: 1000,
      id: "commentInput",
      type: "text",
      placeholder: "Add a comment",
      className: "p-1 w-full"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: addComment,
      className: "p-1 text-indigo-500 hover:text-indigo-700 "
    }, "Post"))) : ""));
  };
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("main", {
    className: "mt-16 mb-16 sm:m-0 sm:ml-16 flex items-center justify-center"
  }, is404 ? /*#__PURE__*/React.createElement(Page404, null) : /*#__PURE__*/React.createElement("section", {
    className: "p-6 max-w-6xl w-full"
  }, post.isReady ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "head flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center "
  }, /*#__PURE__*/React.createElement("img", {
    src: post.user.profile,
    alt: `${post.user.name}'s image`,
    className: "w-12 h-12 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col ml-3 "
  }, /*#__PURE__*/React.createElement(Link, {
    name: post.user.name,
    onClick: setTitle,
    to: data.me.id == post.user.id ? "/me" : `/@${post.user.username}`,
    className: "text-md sm:text-xl font-semibold  max-w-[13ch] sm:max-w-[25ch] lg:max-w-[50ch]"
  }, post.user.name), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre"
  }, timeSince(post.date)), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 mx-1 hidden sm:inline"
  }, "\u2022"), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 whitespace-pre hidden sm:inline"
  }, Math.ceil(cleanMd(post.text).split(" ").length / 200), " ", "min ", /*#__PURE__*/React.createElement("span", {
    className: "hidden md:inline"
  }, "read"))))), data.me.id == post.user.id ? /*#__PURE__*/React.createElement(Link, {
    to: `/write/${post.id}`,
    className: "py-1 px-3 rounded-full active:scale-[0.98] transition-all border-2 border-gray-900 "
  }, "Edit") : /*#__PURE__*/React.createElement("button", {
    onClick: follow,
    className: `py-1 px-3 rounded-full active:scale-[0.98] transition-all border-2 border-indigo-500 focus-visible:scale-110 ${post.user.followed ? "text-indigo-500  bg-white" : "text-white bg-indigo-500"} `
  }, post.user.followed ? "Unfollow" : "Follow")), /*#__PURE__*/React.createElement("div", {
    className: "tags flex mt-3 items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6"
  }, post.tags.map(i => /*#__PURE__*/React.createElement(Tag, {
    tag: i,
    key: i.id
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(`${window.location.origin}/@${post.user.username}/${post.slug}`);
      showMsg("Link copied");
    },
    className: "focus-visible:scale-110"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-link-45deg p-1 cursor-pointer mx-1"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: bookmark,
    className: "flex focus-visible:scale-110"
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-bookmark-${post.bookmark ? "fill" : "plus"} p-1 cursor-pointer mx-1 `
  })))), /*#__PURE__*/React.createElement("article", {
    dir: "auto",
    className: "mt-2",
    dangerouslySetInnerHTML: {
      __html: DOMPurify.sanitize(marked.parse("# " + post.title + "\n" + post.text))
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex mt-6 items-center justify-around text-xl"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mr-2 focus-visible:scale-110",
    onClick: like
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-heart${post.liked ? "-fill" : ""} pl-0 p-1 text-gray-700`
  }), /*#__PURE__*/React.createElement("span", {
    className: "py-1 text-gray-500 text-md"
  }, nFormatter(post.likes))), /*#__PURE__*/React.createElement("button", {
    className: "mr-2 focus-visible:scale-110",
    onClick: () => setShowComments(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi-chat p-1 text-gray-700"
  }), /*#__PURE__*/React.createElement("span", {
    className: "py-1 text-gray-500 text-md"
  }, nFormatter(post.comments))), showComments ? /*#__PURE__*/React.createElement(Container, null) : "", /*#__PURE__*/React.createElement("button", {
    className: "mr-2 focus-visible:scale-110",
    onClick: bookmark
  }, /*#__PURE__*/React.createElement("i", {
    className: `bi bi-bookmark-${post.bookmark ? "fill" : "plus"} p-1 cursor-pointer mx-1  text-gray-700`
  })))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "head flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center overflow-hidden fadeInLoad relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col ml-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-[19ch] sm:max-w-[25ch] lg:max-w-[50ch] h-4 bg-gray-200 rounded-full "
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex mt-1 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-200 h-3 rounded-full w-16"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-200 mx-1"
  }, "\u2022"), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-200 h-3 rounded-full w-16"
  })))), /*#__PURE__*/React.createElement("div", {
    className: `py-1 px-3 rounded-full bg-gray-200 relative fadeInLoad overflow-hidden  w-20 h-8`
  })), /*#__PURE__*/React.createElement("div", {
    className: "tags flex mt-3 items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center whitespace-pre w-[calc(100%-1rem)] overflow-hidden  after:bg-gradient-to-l after:from-white after:to-transparent after:right-0 after:absolute after:h-full after:w-6"
  }, [1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Tag, {
    loading: true,
    key: i
  })))), /*#__PURE__*/React.createElement("article", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-3 rounded-xl bg-gray-200 relative overflow-hidden fadeInLoad w-full h-64"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-3 rounded-xl bg-gray-200 relative overflow-hidden fadeInLoad w-full h-64"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "my-4 mb-2 w-1/2 h-5 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-3/4 h-3 my-1 rounded-full bg-gray-200 fadeInLoad relative overflow-hidden"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "reccomeneds mt-14"
  }, post.isReady ? /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl border-b-2 border-gray-300 mb-4 py-2"
  }, "More From", /*#__PURE__*/React.createElement(Link, {
    name: post.user.name,
    onClick: setTitle,
    to: data.me.id == post.user.id ? "/me" : `/@${post.user.username}`,
    className: "text-indigo-500 mx-1"
  }, post.user.name)) : /*#__PURE__*/React.createElement("div", {
    className: "border-b-2 border-gray-300 mb-4 py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-6 w-3/4 bg-gray-200 overflow-hidden relative fadeInLoad rounded-full"
  })), /*#__PURE__*/React.createElement("div", {
    id: "postsContainer"
  }, posts.isReady ? posts.items.map(p => /*#__PURE__*/React.createElement(Post, {
    post: p,
    key: p.id,
    onTitle: getPost
  })) : [1, 2, 3, 4, 5].map(i => /*#__PURE__*/React.createElement(Post, {
    loading: true,
    key: i
  })), posts.isReady && posts.hasNext ? /*#__PURE__*/React.createElement(Loading, null) : "")))));
};
const Page404 = () => {
  return /*#__PURE__*/React.createElement("main", {
    className: "flex flex-col items-center justify-center w-full h-[100vh]"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-[140px] sm:text-[240px] font-bold"
  }, "404"), /*#__PURE__*/React.createElement("p", null, "Sorry, this page not found :("), /*#__PURE__*/React.createElement(Link, {
    name: "Home",
    onClick: setTitle,
    to: "/",
    className: "m-4 block px-8 py-4 text-white bg-gray-900 rounded-full font-bold"
  }, "Go Home"));
};