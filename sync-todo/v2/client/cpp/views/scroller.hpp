#ifndef SCROLLER_H
#define SCROLLER_H

#include <algorithm>
#include <ftxui/component/component_base.hpp>
#include <ftxui/component/event.hpp>

#include "ftxui/component/component.hpp"
#include "ftxui/component/component_base.hpp"
#include "ftxui/dom/deprecated.hpp"
#include "ftxui/dom/elements.hpp"
#include "ftxui/component/mouse.hpp"

class ScrollerBase: public ftxui::ComponentBase {
 public:
  ScrollerBase(ftxui::Component child);

  int getScrollerIndex() const;
  ftxui::Element Render() final;

 private:
  int indexOfSelectedItem = 0;

  bool OnEvent(ftxui::Event event) final;

  bool Focusable() const final;

  int size_ = 0;
  ftxui::Box box_;
};

std::shared_ptr<ScrollerBase> Scroller(ftxui::Component child);

#endif /* end of include guard: SCROLLER_H */

// Based on Arthur Sonzogni/git-tui (MIT License)