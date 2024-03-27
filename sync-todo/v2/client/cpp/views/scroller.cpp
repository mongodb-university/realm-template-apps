#include "scroller.hpp"

ScrollerBase::ScrollerBase(ftxui::Component child) { Add(child); }

int ScrollerBase::getScrollerIndex() const {
  return _indexOfSelectedItem;
}

ftxui::Element ScrollerBase::Render() {
  auto focused = Focused() ? ftxui::focus : ftxui::select;
  auto style = Focused() ? ftxui::inverted : ftxui::nothing;

  ftxui::Element background = ComponentBase::Render();
  background->ComputeRequirement();
  _size = background->requirement().min_y;
  return ftxui::dbox({
                         std::move(background),
                         ftxui::vbox({
                                         ftxui::text(L"") |
                                             size(ftxui::HEIGHT, ftxui::EQUAL, _indexOfSelectedItem),
                                         ftxui::text(L"") | style | focused,
                                     }),
                     }) |
      ftxui::vscroll_indicator | ftxui::yframe | ftxui::yflex | reflect(_box);
}

bool ScrollerBase::OnEvent(ftxui::Event event) {
  if (event.is_mouse() && _box.Contain(event.mouse().x, event.mouse().y))
    TakeFocus();

  int selected_old = _indexOfSelectedItem;
  if (event == ftxui::Event::ArrowUp || event == ftxui::Event::Character('k') ||
      (event.is_mouse() && event.mouse().button == ftxui::Mouse::WheelUp)) {
    _indexOfSelectedItem--;
  }
  if ((event == ftxui::Event::ArrowDown || event == ftxui::Event::Character('j') ||
      (event.is_mouse() && event.mouse().button == ftxui::Mouse::WheelDown))) {
    _indexOfSelectedItem++;
  }
  if (event == ftxui::Event::PageDown)
    _indexOfSelectedItem += _box.y_max - _box.y_min;
  if (event == ftxui::Event::PageUp)
    _indexOfSelectedItem -= _box.y_max - _box.y_min;
  if (event == ftxui::Event::Home)
    _indexOfSelectedItem = 0;
  if (event == ftxui::Event::End)
    _indexOfSelectedItem = _size;

  _indexOfSelectedItem = std::max(0, std::min(_size - 1, _indexOfSelectedItem));

  return selected_old != _indexOfSelectedItem;
}

bool ScrollerBase::Focusable() const { return true; }

std::shared_ptr<ScrollerBase> Scroller(ftxui::Component child) {
  return ftxui::Make<ScrollerBase>(std::move(child));
}

// Based on Arthur Sonzogni/git-tui (MIT License)