В приложении реализована возможность регистрации пользователей, при регистрации пользователя в бд для него создаются 2-е таблицы, в одной содержатся данные о названиях созданных им списков, во второй все созданные им продукты, элементы (то что нужно сохранить в количественном выражении) со ссылкой на список. Пользователь может создать бесконечное количество списков (добавляются кнопкой плюс) , задать им любые названия и переключаться между ними. В каждый список можно внести любое количество элементов и их количество. В любом элементе меняется его количество и есть возможность удалить этот элемент (создать по новой). Отображается каждый элемент в виде строки в которой название элемента, кнопка отображающая его количество и графа с числом (числовой инпут), которое будет прибавляться (или вычитаться) из количества при каждом нажатии на кнопку. Все данные при каждом нажатии сохраняются как в бд так и локально в браузере, что дает возможность приложению работать из кэша браузера без доступа к интернету, как только доступ возобновляется программа синхронизирует локальные данные и данные в бд.