type Toast = {
  id: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
};

export const alertClass = (type: Toast["type"]) => {
  switch (type) {
    case "info":
      return "alert-info";
    case "success":
      return "alert-success";
    case "warning":
      return "alert-warn";
    case "error":
      return "alert-error";
  }
};

const randomID = () =>
  Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");

class Toasts {
  #toasts = $state<Toast[]>([]);

  get toasts() {
    return this.#toasts;
  }

  add(toast: Pick<Toast, "type" | "text">, timeout = 4000) {
    const id = randomID();
    this.#toasts.push({
      id,
      ...toast,
    });

    setTimeout(() => this.remove(id), timeout);

    return id;
  }

  remove(id: string) {
    this.#toasts = this.#toasts.filter((t) => t.id !== id);
  }
}

export const toasts = new Toasts();
