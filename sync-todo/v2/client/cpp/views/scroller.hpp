#ifndef SCROLLER_HPP
#define SCROLLER_HPP

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
  int _indexOfSelectedItem = 0;

  bool OnEvent(ftxui::Event event) final;

  bool Focusable() const final;

  int _size = 0;
  ftxui::Box _box;
};

std::shared_ptr<ScrollerBase> Scroller(ftxui::Component child);

// Based on Arthur Sonzogni/git-tui (MIT License)
#endif
