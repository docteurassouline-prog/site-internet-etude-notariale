"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { etude } from "@/config/etude";
import { cheminPublic } from "@/lib/chemins";

const navigation = [
  { href: "/etude", label: "L'étude" },
  { href: "/expertises", label: "Expertises" },
  { href: "/tarif", label: "Tarif" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
] as const;

const navigationMobile = [
  ...navigation,
  { href: "/contact", label: "Contact et rendez-vous" },
] as const;

const adresseCourte = etude.adresse.ligne1.split(" — ")[0];

const nomAffiche = etude.nom.replace(/\s(\d+)$/, " $1");

export function SiteHeader() {
  const [ouvert, setOuvert] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(false);
    }
    document.addEventListener("keydown", surTouche);
    return () => document.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  useEffect(() => {
    if (ouvert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  const fermer = useCallback(() => setOuvert(false), []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/95 shadow-[0_1px_12px_rgba(16,28,44,0.06)] backdrop-blur-md"
          : "bg-ivory"
      }`}
    >
      {/* ── Bandeau supérieur : coordonnées (fond sombre, fort contraste) ── */}
      <div
        className={`overflow-hidden bg-night transition-all duration-500 ${
          scrolled ? "max-h-0" : "max-h-14"
        }`}
      >
        <div className="mx-auto flex max-w-grid items-center justify-between px-6 py-2.5">
          {/* L'adresse a quitté ce bandeau le 8 septembre 2026 : elle vit
              désormais sous le nom de l'étude, dans la barre principale, donc
              visible en permanence — y compris au défilement, quand ce
              bandeau se replie. La répéter ici l'aurait affichée deux fois
              en haut de page. */}
          <div className="hidden items-center gap-6 text-[0.8rem] uppercase tracking-[0.12em] text-ivory/90 md:flex">
            <a
              href={`tel:${etude.telephoneE164}`}
              className="font-medium text-ivory no-underline transition-colors hover:text-gold"
            >
              {etude.telephone}
            </a>
            <span className="h-3.5 w-px bg-ivory/25" aria-hidden="true" />
            <a
              href={`mailto:${etude.email}`}
              className="text-ivory/90 no-underline transition-colors hover:text-ivory"
            >
              {etude.email}
            </a>
          </div>
          <div className="flex items-center gap-5 text-[0.8rem] uppercase tracking-[0.08em] text-gold md:gap-6">
            <a
              href={etude.liens.dataRoom}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium no-underline transition-colors hover:text-ivory"
            >
              Accès Data Room
              <span className="sr-only"> (nouvelle fenêtre)</span>
            </a>
          </div>
        </div>
      </div>

      {/* ── Barre principale ── */}
      <div className="mx-auto flex max-w-grid items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-4 no-underline"
        >
          {/* Marque de l'étude — le cercle et le « L » biseauté de l'enseigne,
              relevé sur la photographie de la salle de réunion (voir l'en-tête
              du SVG). Le monogramme « TL » qui tenait cette place était une
              initiale dessinée en CSS, sans existence hors de ce site. */}
          <Image
            src={cheminPublic("/images/logo-levy-notaires.svg")}
            alt=""
            width={100}
            height={100}
            priority
            className="h-12 w-12 shrink-0"
          />
          {/* Filet doré en dégradé : sépare la marque du nom sans poser un
              trait sec, et tient lieu de respiration entre deux objets qui
              n'ont pas la même nature. */}
          <span
            className="hidden h-10 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent sm:block"
            aria-hidden="true"
          />
          <span className="flex flex-col justify-center">
            <span className="text-balance font-serif text-xl font-semibold leading-[1.15] tracking-tight text-night sm:text-[1.4rem]">
              {nomAffiche}
            </span>
            {/* Adresse remontée du portrait de l'accueil (8 septembre 2026) :
                en petites capitales espacées, elle se lit comme une ligne de
                papier à en-tête et non comme une information de service. */}
            <span className="mt-1.5 hidden text-[0.68rem] font-medium uppercase tracking-[0.22em] text-slate-soft transition-colors group-hover:text-gold-ink sm:block">
              {adresseCourte}
              <span className="mx-2 text-gold/70" aria-hidden="true">
                ·
              </span>
              {etude.adresse.codePostal} {etude.adresse.ville}
            </span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-[0.82rem] font-medium uppercase tracking-[0.14em] text-night no-underline transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:text-gold-ink hover:after:w-full"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-block whitespace-nowrap rounded-sm bg-gold px-7 py-3.5 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-night no-underline shadow-[0_1px_2px_rgba(16,28,44,0.16)] transition-colors duration-300 hover:bg-gold-ink hover:text-ivory"
              >
                Prendre rendez-vous
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bouton hamburger mobile */}
        <button
          type="button"
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
          aria-expanded={ouvert}
          aria-controls="menu-mobile"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOuvert(!ouvert)}
        >
          <span
            className={`block h-px w-5 bg-night transition-all duration-300 ${
              ouvert ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-night transition-all duration-300 ${
              ouvert ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-5 bg-night transition-all duration-300 ${
              ouvert ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* ── Menu mobile plein écran ── */}
      <nav
        id="menu-mobile"
        aria-label="Navigation principale"
        className={`fixed inset-0 z-40 flex flex-col bg-ivory transition-all duration-500 lg:hidden ${
          ouvert
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
        style={{ paddingTop: "6rem" }}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-1 px-6">
          <ul className="flex flex-col items-center gap-6">
            {navigationMobile.map((item, i) => (
              <li
                key={item.href}
                className={`transition-all duration-500 ${
                  ouvert
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: ouvert ? `${100 + i * 60}ms` : "0ms",
                }}
              >
                <Link
                  href={item.href}
                  className="font-serif text-2xl text-night no-underline transition-colors hover:text-gold-ink sm:text-3xl"
                  onClick={fermer}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li
              className={`mt-4 transition-all duration-500 ${
                ouvert
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{
                transitionDelay: ouvert
                  ? `${100 + navigationMobile.length * 60}ms`
                  : "0ms",
              }}
            >
              <a
                href={etude.liens.dataRoom}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm uppercase tracking-[0.12em] text-gold-ink no-underline transition-colors hover:text-night"
                onClick={fermer}
              >
                Accès Data Room
                <span className="sr-only"> (nouvelle fenêtre)</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="border-t border-line px-6 py-6 text-center text-[0.75rem] text-slate-soft">
          <a
            href={`tel:${etude.telephoneE164}`}
            className="no-underline hover:text-night"
          >
            {etude.telephone}
          </a>
          <span className="mx-3">·</span>
          <span>
            {adresseCourte}, {etude.adresse.codePostal} {etude.adresse.ville}
          </span>
        </div>
      </nav>

      {/* Filet doré subtil en bas du header */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </header>
  );
}
