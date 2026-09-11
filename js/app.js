(function () {
  const C = window.REVISTA_CONFIG;
  const D = window.REVISTA_DATA;

  function siteUrl() {
    if (C.url) return C.url.replace(/\/$/, "");
    return window.location.origin + window.location.pathname.replace(/[^/]+$/, "");
  }

  function abs(path) {
    const base = siteUrl().replace(/\/$/, "");
    return base + "/" + path.replace(/^\//, "");
  }

  function waLink(number, text) {
    const n = String(number || C.whatsapp).replace(/\D/g, "");
    return "https://wa.me/" + n + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  function mailLink(subject, body) {
    return (
      "mailto:" +
      C.email +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(function () {
      el.classList.remove("show");
    }, 2200);
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          toast("Texto copiado");
        },
        function () {
          toast("No se pudo copiar");
        }
      );
    } else {
      toast("Copiá este texto: " + text);
    }
  }

  function copyBtn(text, label) {
    return (
      '<button type="button" class="btn btn-line" data-copy="' +
      encodeURIComponent(text) +
      '">' +
      (label || "Copiar") +
      "</button>"
    );
  }

  function shareSet(title, url, extra) {
    const line = extra || "Revista Don Torcuato · Edición " + D.edicion.numero;
    const text = title + "\n" + line + "\n" + url;
    return (
      '<div class="sharebar" data-share>' +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' +
      waLink(C.whatsapp, text) +
      '">WhatsApp</a>' +
      '<a class="btn btn-ink" href="' +
      mailLink(title, text) +
      '">Email</a>' +
      copyBtn(url, "Copiar enlace") +
      "</div>"
    );
  }

  function header() {
    const page = document.body.getAttribute("data-page") || "";
    const ed = D.edicion;
    const nav = D.nav
      .map(function (item) {
        return (
          '<a href="' +
          item.href +
          '" class="' +
          (item.page === page ? "is-active" : "") +
          '">' +
          item.label +
          "</a>"
        );
      })
      .join("");

    return (
      '<div class="topbar"><div class="wrap topbar-inner">' +
      "<span>Edición N° " +
      String(ed.numero).padStart(2, "0") +
      " · " +
      ed.mes +
      " " +
      ed.anio +
      " · " +
      C.lugar +
      "</span>" +
      '<span class="topbar-actions">' +
      '<a href="anunciantes.html">Publicar aviso</a>' +
      '<a href="contacto.html">Contacto</a>' +
      "</span></div></div>" +
      '<header class="site-header"><div class="wrap">' +
      '<div class="masthead">' +
      '<div class="masthead-side">Revista digital</div>' +
      '<a class="brand" href="index.html">' +
      '<span class="brand-name">' +
      C.masthead +
      "</span>" +
      '<span class="brand-tag">' +
      C.lema +
      "</span></a>" +
      '<div class="masthead-side right">Tigre · Zona Norte</div>' +
      "</div>" +
      '<button class="nav-toggle" type="button" aria-expanded="false">Menú</button>' +
      '<nav class="nav" id="nav">' +
      nav +
      "</nav></div></header>"
    );
  }

  function footer() {
    const secs = D.secciones
      .map(function (s) {
        return '<div><a href="' + s.href + '">' + s.nombre + "</a></div>";
      })
      .join("");

    return (
      '<footer class="site-footer"><div class="wrap">' +
      '<div class="footer-grid">' +
      "<div><h3>" +
      C.nombre +
      "</h3><p>Se publica en la web y se reparte por WhatsApp, email y redes. Hecha en " +
      C.lugar +
      ".</p></div>" +
      "<div><h3>Secciones</h3>" +
      secs +
      "</div>" +
      "<div><h3>Redacción</h3>" +
      "<div><a href='mailto:" +
      C.email +
      "'>" +
      C.email +
      "</a></div>" +
      "<div><a href='" +
      waLink(C.whatsapp, "Hola, escribo por la revista") +
      "' target='_blank' rel='noopener'>WhatsApp de la revista</a></div>" +
      "<div>Instagram @" +
      C.instagram +
      "</div></div></div>" +
      '<div class="fine">© ' +
      D.edicion.anio +
      " " +
      C.nombre +
      " · Podés subir esta carpeta a cualquier hosting. Cambiá los datos en js/config.js</div>" +
      "</div></footer>"
    );
  }

  function mountChrome() {
    document.body.insertAdjacentHTML("afterbegin", header());
    document.body.insertAdjacentHTML("beforeend", footer());
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.getElementById("nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  function byId(id) {
    return D.articulos.find(function (a) {
      return a.id === id;
    });
  }

  function card(article) {
    return (
      '<a class="card card-link" href="articulo.html?id=' +
      article.id +
      '">' +
      '<span class="kicker">' +
      article.kicker +
      "</span>" +
      "<h3>" +
      article.titulo +
      "</h3>" +
      "<p>" +
      article.bajada +
      "</p>" +
      '<div class="meta">' +
      article.autor +
      " · " +
      article.tiempo +
      "</div></a>"
    );
  }

  function renderHome() {
    const root = document.getElementById("page");
    if (!root) return;
    const ed = D.edicion;
    const cover = D.articulos.find(function (a) {
      return a.portada;
    });
    const dest = D.articulos.filter(function (a) {
      return a.destacado && !a.portada;
    });
    const comercios = D.comercios.filter(function (c) {
      return c.dest;
    });
    const pros = D.profesionales.filter(function (p) {
      return p.dest;
    });

    const urlEdicion = abs("edicion.html");
    root.innerHTML =
      '<section class="cover"><div class="cover-copy">' +
      '<div class="cover-issue">N° ' +
      String(ed.numero).padStart(2, "0") +
      " · " +
      ed.mes +
      " " +
      ed.anio +
      "</div>" +
      "<h1>" +
      ed.titulo +
      "</h1>" +
      "<p>" +
      ed.bajada +
      "</p>" +
      '<div class="actions">' +
      '<a class="btn" href="edicion.html">Leer la edición</a>' +
      '<a class="btn btn-ghost" href="profesionales.html">Buscar un profesional</a>' +
      "</div>" +
      shareSet(C.nombre + " · " + ed.titulo, urlEdicion, C.lugar) +
      '</div><div class="cover-art" aria-hidden="true"></div></section>' +
      '<div class="wrap">' +
      '<section class="section"><div class="section-head"><h2>En esta edición</h2><a href="edicion.html">Ver todo</a></div>' +
      '<div class="feature">' +
      '<a class="feature-art" href="articulo.html?id=' +
      cover.id +
      '"><span>' +
      cover.kicker +
      "</span><strong>" +
      cover.titulo +
      "</strong></a>" +
      '<div class="grid-cards">' +
      dest.map(card).join("") +
      "</div></div></section>" +
      '<section class="section"><div class="ad"><div class="ad-label">Espacio del anunciante</div><strong>Farmacia Reconquista</strong><p>Obra social, dermocosmética y delivery en Don Torcuato. Publicá el tuyo en la próxima edición.</p><div class="actions"><a class="btn btn-ink" href="anunciantes.html">Quiero anunciar</a></div></div></section>' +
      '<section class="section"><div class="section-head"><h2>Secciones</h2></div><div class="grid-3 section-tiles">' +
      D.secciones
        .map(function (s) {
          return "<a href='" + s.href + "'><p>" + s.desc + "</p><h3>" + s.nombre + "</h3></a>";
        })
        .join("") +
      "</div></section>" +
      '<section class="section"><div class="section-head"><h2>Comercios destacados</h2><a href="comercios.html">Guía completa</a></div><div class="grid-cards">' +
      comercios
        .map(function (c) {
          return comercioCard(c);
        })
        .join("") +
      "</div></section>" +
      '<section class="section"><div class="section-head"><h2>Profesionales de la semana</h2><a href="profesionales.html">Buscador</a></div><div class="grid-cards">' +
      pros
        .map(function (p) {
          return proCard(p);
        })
        .join("") +
      "</div></section></div>";
  }

  function comercioCard(c) {
    return (
      '<article class="card">' +
      (c.dest ? '<span class="badge badge-hot">Destacado</span>' : '<span class="badge">' + c.rubro + "</span>") +
      "<h3>" +
      c.nombre +
      "</h3>" +
      "<p>" +
      c.desc +
      "</p>" +
      '<div class="meta">' +
      c.dir +
      "<br>" +
      c.horario +
      "</div>" +
      '<div class="wa-row">' +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' +
      waLink(c.wa, "Hola, los vi en Revista Don Torcuato") +
      '">WhatsApp</a>' +
      '<a class="btn btn-line" href="tel:' +
      c.tel.replace(/\s/g, "") +
      '">Llamar</a></div></article>'
    );
  }

  function proCard(p) {
    return (
      '<article class="card pro-card">' +
      (p.dest ? '<span class="badge badge-hot">Destacado</span>' : '<span class="badge">' + p.rubro + "</span>") +
      '<p class="name">' +
      p.nombre +
      "</p>" +
      "<p>" +
      p.oficio +
      " · " +
      p.zona +
      "</p>" +
      "<p>" +
      p.desc +
      "</p>" +
      '<div class="meta">' +
      p.dir +
      " · " +
      p.mat +
      "</div>" +
      '<div class="wa-row"><a class="btn btn-wa" target="_blank" rel="noopener" href="' +
      waLink(p.wa, "Hola " + p.nombre + ", te escribo por Revista Don Torcuato") +
      '">Pedir turno</a></div></article>'
    );
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  var SINONIMOS = {
    plomero: "plomer",
    plomera: "plomer",
    medico: "medic",
    medica: "medic",
    doctor: "dra",
    doctora: "dra",
    electricista: "electr",
    abogado: "abog",
    abogada: "abog",
    contador: "contad",
    arquitecto: "arquit",
    psicologo: "psicolog",
    veterinario: "veterin",
    ferreteria: "ferreter",
    panaderia: "panader",
  };

  function coincide(item, q) {
    var nq = norm(q).trim();
    if (!nq) return true;
    var blob = norm(
      [
        item.nombre,
        item.oficio,
        item.rubro,
        item.zona,
        item.desc,
        item.dir,
        item.horario,
        item.busca,
      ].join(" ")
    );
    if (blob.indexOf(nq) !== -1) return true;
    if (SINONIMOS[nq] && blob.indexOf(SINONIMOS[nq]) !== -1) return true;
    if (nq.length >= 5 && blob.indexOf(nq.slice(0, 5)) !== -1) return true;
    return false;
  }

  function unique(list, key) {
    return list
      .map(function (item) {
        return item[key];
      })
      .filter(function (v, i, arr) {
        return arr.indexOf(v) === i;
      });
  }

  function renderComercios() {
    const root = document.getElementById("page");
    const rubros = unique(D.comercios, "rubro");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Guía del barrio</p><h1>Comercios de Don Torcuato</h1><p>Almacenes, oficios, salud y gastronomía para comprar cerca. Cada ficha viaja en la edición que se comparte por WhatsApp y email.</p></div>' +
      '<div class="wrap section"><div class="filters">' +
      '<input id="q" type="search" placeholder="Buscar comercio, rubro o calle">' +
      '<select id="rubro"><option value="">Todos los rubros</option>' +
      rubros
        .map(function (r) {
          return "<option>" + r + "</option>";
        })
        .join("") +
      '</select></div><div id="lista" class="grid-cards"></div></div>';

    function paint() {
      const q = document.getElementById("q").value.toLowerCase();
      const r = document.getElementById("rubro").value;
      const items = D.comercios.filter(function (c) {
        return (!r || c.rubro === r) && coincide(c, q);
      });
      document.getElementById("lista").innerHTML = items.length
        ? items.map(comercioCard).join("")
        : '<div class="empty">No hay comercios con ese filtro. Publicá el tuyo.</div>';
    }
    document.getElementById("q").addEventListener("input", paint);
    document.getElementById("rubro").addEventListener("change", paint);
    paint();
  }

  function renderProfesionales() {
    const root = document.getElementById("page");
    const rubros = unique(D.profesionales, "rubro");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Buscador</p><h1>Profesionales del barrio</h1><p>Médicos, estudios, oficios y clases. Filtrá por especialidad o escribí un nombre. El contacto sale directo a WhatsApp.</p></div>' +
      '<div class="wrap section"><div class="filters">' +
      '<input id="q" type="search" placeholder="Buscar por nombre, oficio o zona">' +
      '<select id="rubro"><option value="">Todas las categorías</option>' +
      rubros
        .map(function (r) {
          return "<option>" + r + "</option>";
        })
        .join("") +
      '</select></div><div id="lista" class="grid-cards"></div></div>';

    function paint() {
      const q = document.getElementById("q").value.toLowerCase();
      const r = document.getElementById("rubro").value;
      const items = D.profesionales.filter(function (p) {
        return (!r || p.rubro === r) && coincide(p, q);
      });
      document.getElementById("lista").innerHTML = items.length
        ? items.map(proCard).join("")
        : '<div class="empty">Nadie coincide. Probá otra palabra o publicá tu ficha.</div>';
    }
    document.getElementById("q").addEventListener("input", paint);
    document.getElementById("rubro").addEventListener("change", paint);
    paint();
  }

  function renderClasificados() {
    const root = document.getElementById("page");
    const tipos = unique(D.clasificados, "tipo");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Avisos de vecinos</p><h1>Clasificados</h1><p>Alquileres, ventas, empleos y servicios. Un aviso corto que se lee en el celular y se reenvía.</p>' +
      '<div class="actions"><a class="btn btn-ink" href="contacto.html">Publicar un clasificado</a></div></div>' +
      '<div class="wrap section"><div class="filters"><select id="tipo"><option value="">Todos</option>' +
      tipos
        .map(function (t) {
          return "<option>" + t + "</option>";
        })
        .join("") +
      '</select></div><div id="lista" class="grid-cards"></div></div>';

    function paint() {
      const t = document.getElementById("tipo").value;
      const items = D.clasificados.filter(function (c) {
        return !t || c.tipo === t;
      });
      document.getElementById("lista").innerHTML = items
        .map(function (c) {
          return (
            '<article class="card">' +
            (c.dest ? '<span class="badge badge-hot">' + c.tipo + "</span>" : '<span class="badge">' + c.tipo + "</span>") +
            "<h3>" +
            c.titulo +
            "</h3><p>" +
            c.texto +
            '</p><div class="meta">Contacto ' +
            c.contacto +
            "</div></article>"
          );
        })
        .join("");
    }
    document.getElementById("tipo").addEventListener("change", paint);
    paint();
  }

  function renderEventos() {
    const root = document.getElementById("page");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Septiembre en el barrio</p><h1>Agenda</h1><p>Ferias, clubes, escuelas y charlas. Mandá tu evento y viaja en la edición.</p></div>' +
      '<div class="wrap section"><div class="timeline">' +
      D.eventos
        .map(function (e) {
          return (
            '<article class="event"><div class="event-date">' +
            e.fecha +
            "<br>" +
            e.hora +
            "</div><div><h3>" +
            e.titulo +
            "</h3><p>" +
            e.desc +
            '</p><div class="meta">' +
            e.lugar +
            "</div></div></article>"
          );
        })
        .join("") +
      "</div></div>";
  }

  function renderAnunciantes() {
    const root = document.getElementById("page");
    const url = abs("anunciantes.html");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Para comercios y profesionales</p><h1>Anunciá donde el barrio reenvía</h1><p>La revista se publica en el hosting y se reparte por WhatsApp, email e Instagram. Tu aviso no se queda quieto: se comparte.</p>' +
      shareSet("Quiero anunciar en Revista Don Torcuato", url, "Paquetes para comercios y profesionales") +
      "</div>" +
      '<div class="wrap section"><div class="grid-cards">' +
      D.paquetes
        .map(function (p) {
          return (
            '<article class="pack"><div class="price">' +
            p.precio +
            "</div><h3>" +
            p.nombre +
            "</h3><p>" +
            p.detalle +
            "</p><ul>" +
            p.items
              .map(function (i) {
                return "<li>" + i + "</li>";
              })
              .join("") +
            '</ul><a class="btn btn-ink" href="contacto.html">Pedir este espacio</a></article>'
          );
        })
        .join("") +
      "</div></div>" +
      '<div class="wrap section"><div class="section-head"><h2>En esta edición anuncian</h2></div><div class="grid-4">' +
      D.anunciantes
        .map(function (a) {
          return (
            '<article class="ad"><div class="ad-label">' +
            a.tipo +
            "</div><strong>" +
            a.nombre +
            "</strong><p>" +
            a.rubro +
            "</p></article>"
          );
        })
        .join("") +
      "</div></div>";
  }

  function renderContacto() {
    const root = document.getElementById("page");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Redacción y comercial</p><h1>Escribinos</h1><p>Para anunciar, sumar un profesional, mandar un evento o proponer una nota. Respondemos por WhatsApp o email.</p></div>' +
      '<div class="wrap section grid-2"><form class="form" id="form-contacto">' +
      '<div class="field"><label for="nombre">Nombre</label><input id="nombre" name="nombre" required></div>' +
      '<div class="field"><label for="tipo">Motivo</label><select id="tipo" name="tipo"><option>Quiero anunciar</option><option>Soy comercio</option><option>Soy profesional</option><option>Quiero publicar un clasificado</option><option>Quiero mandar un evento</option><option>Quiero proponer una nota</option></select></div>' +
      '<div class="field"><label for="tel">WhatsApp</label><input id="tel" name="tel" required></div>' +
      '<div class="field"><label for="mail">Email</label><input id="mail" name="mail" type="email" required></div>' +
      '<div class="field"><label for="msg">Mensaje</label><textarea id="msg" name="msg" rows="5" required></textarea></div>' +
      '<button class="btn btn-ink" type="submit">Enviar por WhatsApp</button>' +
      '<a class="btn btn-line" href="mailto:' +
      C.email +
      '">O abrir el mail</a></form>' +
      '<div><div class="note"><h3>Cómo se distribuye</h3><p>Cada edición queda online en tu hosting. Desde ahí se manda el enlace por WhatsApp a grupos del barrio, por email a la lista de suscriptores y por Instagram o Facebook.</p></div>' +
      '<p class="muted">' +
      C.lugar +
      "<br>" +
      C.telefono +
      "<br>" +
      C.email +
      "</p></div></div>";

    document.getElementById("form-contacto").addEventListener("submit", function (ev) {
      ev.preventDefault();
      const f = ev.target;
      const text =
        "Hola, soy " +
        f.nombre.value +
        ".\nMotivo: " +
        f.tipo.value +
        "\nWhatsApp: " +
        f.tel.value +
        "\nEmail: " +
        f.mail.value +
        "\n\n" +
        f.msg.value;
      window.open(waLink(C.whatsapp, text), "_blank");
    });
  }

  function renderEdicion() {
    const root = document.getElementById("page");
    const ed = D.edicion;
    const url = abs("edicion.html");
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Edición N° ' +
      String(ed.numero).padStart(2, "0") +
      "</p><h1>" +
      ed.titulo +
      "</h1><p>" +
      ed.bajada +
      "</p>" +
      shareSet(C.nombre + " N° " + ed.numero + " · " + ed.titulo, url, ed.fecha) +
      '<div class="actions"><button type="button" class="btn btn-line" onclick="window.print()">Imprimir / guardar PDF</button></div></div>' +
      '<div class="wrap section">' +
      D.articulos
        .map(function (a) {
          return (
            '<article class="edition-sheet">' +
            '<p class="kicker">' +
            a.kicker +
            "</p><h2>" +
            a.titulo +
            "</h2><p class='muted'>" +
            a.bajada +
            "</p>" +
            a.cuerpo
              .map(function (p) {
                return "<p>" + p + "</p>";
              })
              .join("") +
            '<div class="meta">' +
            a.autor +
            " · " +
            a.tiempo +
            ' · <a href="articulo.html?id=' +
            a.id +
            '">Abrir nota</a></div></article>'
          );
        })
        .join("") +
      "</div>";
  }

  function renderActualidad() {
    const root = document.getElementById("page");
    const barrio = D.articulos.filter(function (a) {
      return a.seccion === "barrio";
    });
    const rest = D.articulos.filter(function (a) {
      return a.seccion !== "barrio";
    });
    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Actualidad</p><h1>Lo que pasa en Don Torcuato</h1><p>Notas de la edición, historias de barrio y la oficina comercial.</p></div>' +
      '<div class="wrap section"><div class="grid-cards">' +
      rest.map(card).join("") +
      '</div></div><div class="wrap section" id="barrio"><div class="section-head"><h2>Barrio</h2></div><div class="grid-cards">' +
      barrio.map(card).join("") +
      "</div></div>";
  }

  function renderArticulo() {
    const params = new URLSearchParams(window.location.search);
    const art = byId(params.get("id")) || D.articulos[0];
    const url = abs("articulo.html?id=" + art.id);
    document.title = art.titulo + " · " + C.nombre;
    const related = D.articulos
      .filter(function (a) {
        return a.id !== art.id;
      })
      .slice(0, 3);
    document.getElementById("page").innerHTML =
      '<div class="wrap page-hero"><p class="kicker">' +
      art.kicker +
      "</p><h1>" +
      art.titulo +
      "</h1><p>" +
      art.bajada +
      '</p><div class="meta">' +
      art.autor +
      " · " +
      art.tiempo +
      "</div>" +
      shareSet(art.titulo, url, C.nombre) +
      "</div>" +
      '<div class="wrap article"><div class="article-body">' +
      art.cuerpo
        .map(function (p) {
          return "<p>" + p + "</p>";
        })
        .join("") +
      '</div><aside class="side-box"><p class="kicker">También en esta edición</p>' +
      related
        .map(function (a) {
          return '<p><a href="articulo.html?id=' + a.id + '">' + a.titulo + "</a></p>";
        })
        .join("") +
      '<hr><p class="muted">¿Querés anunciar al lado de esta nota?</p><a class="btn btn-ink" href="anunciantes.html">Ver paquetes</a></aside></div>';
  }

  function bindShare() {
    document.body.addEventListener("click", function (ev) {
      const btn = ev.target.closest("[data-copy]");
      if (btn) copy(decodeURIComponent(btn.getAttribute("data-copy") || ""));
    });
  }

  function renderDifundir() {
    const root = document.getElementById("page");
    const ed = D.edicion;
    const url = abs("edicion.html");
    const waTexto =
      "Salió Revista Don Torcuato N° " +
      ed.numero +
      " · " +
      ed.titulo +
      "\n" +
      ed.bajada +
      "\nLeela acá: " +
      url;
    const mailTexto =
      "Hola,\n\nCompartimos la edición " +
      ed.numero +
      " de Revista Don Torcuato (" +
      ed.mes +
      " " +
      ed.anio +
      ").\n\n" +
      ed.titulo +
      "\n" +
      ed.bajada +
      "\n\nAbrí la revista: " +
      url +
      "\n\nSi querés anunciar o sumar tu ficha profesional, respondé este mail.\n\nRedacción TORCUATO";

    root.innerHTML =
      '<div class="wrap page-hero"><p class="kicker">Distribución</p><h1>Mandá la edición por WhatsApp, email y redes</h1><p>La revista vive en el hosting. Estos textos ya están listos para copiar y reenviar a grupos del barrio, listas de mail y estados.</p></div>' +
      '<div class="wrap section grid-2">' +
      '<article class="card"><p class="kicker">WhatsApp</p><h3>Mensaje para grupos</h3><p>' +
      waTexto.replace(/\n/g, "<br>") +
      '</p><div class="wa-row">' +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' +
      waLink(C.whatsapp, waTexto) +
      '">Abrir WhatsApp</a>' +
      copyBtn(waTexto, "Copiar texto") +
      '</div></article>' +
      '<article class="card"><p class="kicker">Email</p><h3>Cuerpo para la lista</h3><p>' +
      mailTexto.replace(/\n/g, "<br>") +
      '</p><div class="wa-row">' +
      '<a class="btn btn-ink" href="' +
      mailLink("Revista Don Torcuato N° " + ed.numero + " · " + ed.titulo, mailTexto) +
      '">Abrir el mail</a>' +
      copyBtn(mailTexto, "Copiar texto") +
      "</div></article></div>" +
      '<div class="wrap section"><div class="grid-3">' +
      '<article class="note"><h3>1. Publicar</h3><p>Subí la carpeta al hosting (cPanel, FTP o el administrador de archivos). La home queda en index.html.</p></article>' +
      '<article class="note"><h3>2. Compartir el enlace</h3><p>Usá la URL de edicion.html. Es la misma para WhatsApp, mail, Instagram y el estado del comercio.</p></article>' +
      '<article class="note"><h3>3. PDF de mostrador</h3><p>En la edición tocá Imprimir / guardar PDF y dejalo en el local o adjuntalo al mail.</p></article>' +
      "</div></div>" +
      '<div class="wrap section"><div class="ad"><div class="ad-label">Plantilla HTML</div><strong>email/edicion.html</strong><p>Hay una versión angosta, lista para pegar en Gmail, Outlook o un envío masivo. Actualizá el enlace de tu dominio antes de mandarla.</p><div class="actions"><a class="btn btn-ink" href="email/edicion.html">Ver plantilla</a></div></div></div>';
  }

  const pages = {
    home: renderHome,
    edicion: renderEdicion,
    actualidad: renderActualidad,
    articulo: renderArticulo,
    comercios: renderComercios,
    profesionales: renderProfesionales,
    clasificados: renderClasificados,
    eventos: renderEventos,
    anunciantes: renderAnunciantes,
    contacto: renderContacto,
    difundir: renderDifundir,
  };

  document.addEventListener("DOMContentLoaded", function () {
    mountChrome();
    bindShare();
    const page = document.body.getAttribute("data-page");
    if (pages[page]) pages[page]();
  });
})();
